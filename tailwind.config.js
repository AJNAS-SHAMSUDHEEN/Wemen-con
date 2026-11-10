/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d2d9',
          300: '#f4aab8',
          400: '#ec768e',
          500: '#df4668',
          600: '#c8264d',
          700: '#a81b3d',
          800: '#8c1936',
          900: '#751931',
          950: '#420917',
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
