/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      backgroundImage:{
        'login-bg': "url('/assets/bg-01.jpg')"
      },
      backgroundColor:{
        'primary-bg':"#019676"
      },
      colors: {
        primary: "#019676",
        secondary: "rgba(248, 150, 51, 0.95)",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
        borderBase: "rgb(229,231,235)"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
