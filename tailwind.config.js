/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Rajdhani", "Barlow Condensed", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(16, 185, 129, 0.25)",
      },
    },
  },
  plugins: [],
};
