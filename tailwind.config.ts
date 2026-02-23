import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          background: "#050509",
          surface: "#0F0F16",
          accent: "#FF6A00",
          accentSoft: "#FF9440",
          border: "#262636"
        }
      },
      boxShadow: {
        forgeGlow: "0 0 40px rgba(255, 106, 0, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
