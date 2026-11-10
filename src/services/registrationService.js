import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { generateRegistrationId } from "../utils/formatters";
import { formatToStandard10Digit } from "../utils/validators";

const REGISTRATIONS_COLLECTION = "registrations";

/**
 * Check if a participant with this phone number is already registered
 */
export const checkDuplicatePhone = async (phone) => {
  const cleanPhone = formatToStandard10Digit(phone);
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    where("phoneNumber", "==", cleanPhone)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const existing = snapshot.docs[0].data();
    return {
      isDuplicate: true,
      existingId: existing.registrationId || snapshot.docs[0].id,
      existingName: existing.fullName,
    };
  }
  return { isDuplicate: false };
};

/**
 * Submit a new registration to Cloud Firestore
 */
export const createRegistration = async ({
  fullName,
  phoneNumber,
  place,
  foodPreference,
  preferredTime,
  latitude = null,
  longitude = null,
  locationAccuracy = null,
}) => {
  const cleanPhone = formatToStandard10Digit(phoneNumber);

  // Check duplicate
  const duplicateCheck = await checkDuplicatePhone(cleanPhone);
  if (duplicateCheck.isDuplicate) {
    const err = new Error(
      `A registration with phone number ending in ${cleanPhone.slice(-4)} already exists (ID: ${duplicateCheck.existingId}).`
    );
    err.code = "DUPLICATE_PHONE";
    err.existingId = duplicateCheck.existingId;
    throw err;
  }

  const registrationId = generateRegistrationId();
  const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);

  const payload = {
    registrationId,
    fullName: fullName.trim(),
    phoneNumber: cleanPhone,
    place: place.trim(),
    foodPreference: foodPreference || "Food Required",
    preferredTime: preferredTime || "Morning Session (09:00 AM - 01:00 PM)",
    latitude: latitude !== null && !isNaN(latitude) ? Number(latitude) : null,
    longitude: longitude !== null && !isNaN(longitude) ? Number(longitude) : null,
    locationAccuracy: locationAccuracy !== null && !isNaN(locationAccuracy) ? Number(locationAccuracy) : null,
    hasGpsLocation: latitude !== null && longitude !== null,
    status: "Confirmed", // Default status
    notes: "",
    registrationDate: serverTimestamp(),
    createdAt: new Date().toISOString(),
  };

  await setDoc(docRef, payload);

  return {
    ...payload,
    registrationDate: new Date(), // Local fallback for immediate UI rendering
  };
};

/**
 * Subscribe to real-time registrations for Admin Dashboard
 */
export const subscribeToAllRegistrations = (onData, onError) => {
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    orderBy("registrationDate", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
        };
      });
      onData(list);
    },
    (error) => {
      console.error("Firestore real-time subscription error:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * Subscribe to public participant list
 * (Ensures sensitive data like phone number and exact GPS are masked on public side)
 */
export const subscribeToPublicParticipants = (onData, onError) => {
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    orderBy("registrationDate", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          registrationId: data.registrationId || docSnap.id,
          fullName: data.fullName,
          place: data.place,
          foodPreference: data.foodPreference,
          preferredTime: data.preferredTime,
          status: data.status || "Confirmed",
          registrationDate: data.registrationDate,
          // Masked / No phone or GPS for public security
        };
      });
      onData(list);
    },
    (error) => {
      console.error("Public participants subscription error:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * Update a registration document
 */
export const updateRegistration = async (id, updateFields) => {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updateFields,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a registration document
 */
export const deleteRegistration = async (id) => {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
  await deleteDoc(docRef);
};
