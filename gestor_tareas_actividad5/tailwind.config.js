/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },
      backgroundImage: {
        'office': "url('/images/trabajo_oficina.jpg')",
      }
    },
  },
  plugins: [],
}