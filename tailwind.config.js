/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft & elegant lavender palette
        lavender: {
          50: '#f8f7fc',
          100: '#f0edf8',
          200: '#e3dcf2',
          300: '#cfc2e9',
          400: '#b4a0dc',
          500: '#997ecc',
          600: '#8464bf',
          700: '#7252ae',
          800: '#5e4192',
          900: '#4d3578',
          950: '#2b1b46',
        },
        // Alias brand to lavender to unify theme across all components
        brand: {
          50: '#f8f7fc',
          100: '#f0edf8',
          200: '#e3dcf2',
          300: '#cfc2e9',
          400: '#b4a0dc',
          500: '#997ecc',
          600: '#8464bf',
          700: '#7252ae',
          800: '#5e4192',
          900: '#4d3578',
          950: '#2b1b46',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        ml: ['Noto Sans Malayalam', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
