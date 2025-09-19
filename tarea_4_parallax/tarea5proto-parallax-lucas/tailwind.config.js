/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{html,js,astro,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          beige: "#e5e0d8",
          accent: "#d4b996",
          done: "#d1e7dd",
          danger: "#dc3545",
          dangerDark: "#bb2d3b",
        },
      },
    },
    plugins: [],
  }
  