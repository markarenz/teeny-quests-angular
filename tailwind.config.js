/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#1dce52",
        "primary-50": "rgba(29, 205, 82, 0.5)",
        "black-50": "rgba(0, 0, 0, 0.75)",
        primaryDark: "#068c2e",
        primaryDarker: "#024717",
        secondary: "#ecc94b",
      },
    },
  },
  plugins: [],
};
