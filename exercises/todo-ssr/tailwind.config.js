/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}", // Asegúrate de incluir todos los archivos relevantes
  ],
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
