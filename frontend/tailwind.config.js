/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "7eleven": {
          red:    "#E31837",
          green:  "#007A33",
          orange: "#F26522",
          dark:   "#1A1A1A",
          light:  "#F5F5F5",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}