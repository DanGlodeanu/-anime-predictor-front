module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '160': '40rem',
      },
      backgroundColor: {
        "primary": "#c9cdb9",
        "black2": "#141416"
      },
      placeholder: {
        "black2": "#141416"
      },
      textColor: {
        "white2": "#f8f9fa",
        "error": "#dc3545"
      },
      borderColor: {
        "white2": "#f8f9fa",
        "error": "#dc3545"
      },
      minHeight: {
        '96': '24rem'
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
              opacity: "0",
              transform: "translateY(10px)"
          },
          "100%": {
              opacity: "1",
              transform: "translateY(0)"
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 2s ease-out',
      }
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}
