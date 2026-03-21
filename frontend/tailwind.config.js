/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  colors: {
    background: "#FDF6E3",
    foreground: "#2C1A0E",

    primary: "#5C3D1E",
    "primary-foreground": "#FDF6E3",

    secondary: "#E6A817",
    muted: "#F5EDD8",
    border: "rgba(92, 61, 30, 0.15)",
  },
  fontFamily: {
    sans: ["Inter", "sans-serif"],
  },
},
  },
  plugins: [],
};