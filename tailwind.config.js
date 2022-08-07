module.exports = {
  darkMode: 'media', // bool or 'media' (system setting) or 'class' (toggle manually)
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js"
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ["Roboto Mono", "sans-serif"],
      },
      keyframes: {
        "pulse-full": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          }
        }
      },
      animation: {
        "pulse-full": "pulse-full 1s ease alternate infinite",
      },
      colors: {
        theme: {
          primary: "",
          primaryVariant: "",
          secondary: "",
          secondaryVariant: "",
          background: "#121212",
          surface: "#333333",
          // error: "",
          onPrimary: "#121212",
          onSecondary: "#121212",
          onBackground: "#f5f5f5",
          onSurface: "#f5f5f5",
          // onError: ""
        }
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
