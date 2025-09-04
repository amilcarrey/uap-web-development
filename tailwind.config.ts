/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        star: {
          DEFAULT: '#fbbf24',
          empty: '#d1d5db',
        },
      },
    },
  },
  plugins: [],
}
