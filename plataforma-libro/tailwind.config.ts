import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        federant: ["var(--font-federant)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;


