import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C97C5D",
        secondary: "#E8D8C4",
        accent: "#C97C5D",
        surface: "#F6F3EE",
        dark: "#2D2D2D",
        success: "#4CAF50",
        warning: "#F4B400",
        error: "#E53935"
      }
    }
  },
  plugins: []
};

export default config;
