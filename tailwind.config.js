/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#195de6',
        'background-dark': '#111621',
        'surface-dark': '#1c212c',
        'charcoal-dark': '#0d1015',
        'text-secondary': '#9da6b8',
        'background-light': '#f6f6f8',
        'surface-light': '#ffffff',
      },
    },
  },
  plugins: [],
}
