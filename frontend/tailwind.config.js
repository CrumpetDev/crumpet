/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      dropShadow: {
        lg: '4px 4px 16px rgba(0, 0, 0, 0.15)',
      },
    },
    plugins: [],
  },
};
