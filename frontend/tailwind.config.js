const rtl = require('tailwindcss-rtl')

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Segoe UI', 'Tahoma', 'sans-serif'] },
    },
  },
  plugins: [rtl()],
};
