/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#1dce52",
        primaryDark: "#068c2e",
        primaryDarker: "#024717",
        secondary: "#ecc94b",
      },
    },
  },
  plugins: [],
};
