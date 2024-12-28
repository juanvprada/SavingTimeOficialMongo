/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "3rem",
        xl: "7rem",
        "2xl": "8rem",
      },
    },
    extend: {
      colors: {
        primary: {
          "50": "#F7FEE7",
          "100": "#ECFCCB",
          "200": "#D9F99D",
          "300": "#BEF264",
          "400": "#A3E635",
          "500": "#84CC16",
          "600": "#65A30D",
          "700": "#4D7C0F",
          "800": "#3F6212",
          "900": "#365314",
          "950": "#1A2E05",
        },
        secondary: {
          "50": "#ECFDF5",
          "100": "#D1FAE5",
          "200": "#A7F3D0",
          "300": "#6EE7B7",
          "400": "#34D399",
          "500": "#10B981",
          "600": "#059669",
          "700": "#047857",
          "800": "#065F46",
          "900": "#064E3B",
          "950": "#022C22",
        },
        customGreen: '#6BE73E',
        first: "#00040f",
        second: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
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
}

