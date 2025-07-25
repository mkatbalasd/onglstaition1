module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [require('tailwindcss-rtl')],
};
