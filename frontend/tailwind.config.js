const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'sans-serif'],
      },
      colors: {
        gray: colors.gray,
        blue: colors.blue
      }
    },
  },
  plugins: [require('tailwindcss-rtl')],
};
