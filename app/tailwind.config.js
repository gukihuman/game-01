/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-100": "spin 100s linear infinite",
        "spin-70": "spin 70s linear infinite",
        "spin-30": "spin 30s linear infinite",
        "spin-10": "spin 10s linear infinite",
      },
      fontFamily: {
        sans: ["ABeeZee", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
  safelist: ["router-link-active"],
};
