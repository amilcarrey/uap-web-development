// postcss.config.mjs (CORREGIDO)

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- ¡ESTA ES LA LÍNEA CORRECTA!
    autoprefixer: {},
  },
};

export default config;