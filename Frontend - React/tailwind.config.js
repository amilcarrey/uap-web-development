/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Usa 'class' en lugar de 'media'
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Aquí indica dónde Tailwind buscará clases CSS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

