import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        heading: ['"Outfit"', '"Inter"', 'sans-serif'],
        pixel: ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;