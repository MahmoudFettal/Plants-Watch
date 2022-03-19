module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "ui-sans-serif", "system-ui"],
    },
    extend: {
      colors: {
        font: "#0F0E08",
        leaf: "#ABC030"
      },
      width: {
        '75': "75vw",
        '33': "33vw",
        '50': "50vw"
      }
    },
  },
  plugins: [require('@tailwindcss/forms'),],
};
