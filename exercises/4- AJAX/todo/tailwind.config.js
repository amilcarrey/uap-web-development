/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", // Asegurate de incluir todas tus rutas relevantes
    ],
    theme: {
      extend: {
        colors: {
          beige: 'rgba(241, 236, 230, 255)',
          light_blue: 'rgb(116,178,202)',
          wheat: 'rgba(243,243,243,255)',
          add_category: 'rgba(173,131,131,255)',
          add_category_hover: 'rgb(202, 68, 68)',
          // agregá los colores que definiste en :root
        },
        fontFamily: {
          lexend: ['"Lexend"', 'sans-serif'],
          montserrat: ['"Montserrat"', 'sans-serif'],
          libre: ['"Libre Baskerville"', 'serif'],
        },
      },
    },
    plugins: [],
  }