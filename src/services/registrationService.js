import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp,
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
 * Submit a new registration to Cloud Firestore (Food option avoided)
 */
export const createRegistration = async ({
  fullName,
  phoneNumber,
  place,
}) => {
  const cleanPhone = formatToStandard10Digit(phoneNumber);

  // Check duplicate phone
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
    preferredTime: "9:30 AM - 4:00 PM",
    conferenceName: "Wisdom Women Conference — Iritty Mandalam",
    eventDate: "2026 November 21, Saturday",
    venue: "Choice Auditorium, Nuchiyad Road, Ulikkal",
    status: "Confirmed",
    notes: "",
    registrationDate: serverTimestamp(),
    createdAt: new Date().toISOString(),
  };

  await setDoc(docRef, payload);

  return {
    ...payload,
    registrationDate: new Date(),
  };
};

/**
 * Subscribe to all registrations - Accessible ONLY by Admin Dashboard
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
      console.error("Firestore subscription error:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * Real-time count of total registrations for public banner
 */
export const subscribeToRegistrationCount = (onCount, onError) => {
  const q = query(collection(db, REGISTRATIONS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      onCount(snapshot.size);
    },
    (error) => {
      console.error("Public count listener error:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * Update a registration document (Admin only)
 */
export const updateRegistration = async (id, updateFields) => {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updateFields,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a registration document (Admin only)
 */
export const deleteRegistration = async (id) => {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
  await deleteDoc(docRef);
};
