/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/**/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontSize: {
        xs: "11px",
        sm: "13px",
        md: "15px",
        base: "17px",
        lg: "20px",
        xl: "25px",
        "2xl": "30px",
        "3xl": "35px",
        "4xl": "50px",
        "5xl": "60px",
      },
      fontFamily: {
        serif: ["Montserrat", "PNU"],
      },
      colors: {
        primary: {
          color1: "#497B62",
          color2: "#2B5540",
          color3: "#6C9583",
          color4: "#B0D8C4",
        },
        seconder: {
          color1: "#B5CBC2",
          color2: "#DAE5E0",
        },
        textColor: "#8B8B8B",
        textColor2: "#B6EED6",
        lightGreen: "#D2ECDF",
        darkGreen: "#65947F",
        lineColor: { color1: "#939393", color2: "#A9A9A9" },
        errorContainer: "#EDBBBB",
        errorIcon: "#BD5151",
        darkGrey: "#647d68",
      },
      screens: {
        sm: "0px",
        md: "768px",
        lg: "996px",
        xl: "1440px",
      },
      container: {
        center: true,
        padding: {
          sm: "1.1rem",
          lg: "1.1rem",
          xl: "2.6rem",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
