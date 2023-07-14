/** @type {import('tailwindcss').Config} */

/* eslint-disable */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      dropShadow: {
        lg: '4px 4px 16px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heebo: ['Heebo', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'crumpet-light': {
          100: '#FBF8F3',
          200: '#F5F0E7',
          300: '#E9E2D6',
        },
        'crumpet-bright': {
          100: '#FFF7EB',
          500: '#FFC76D',
        },
        'crumpet-dark': {
          300: '#ACA69A',
          500: '#989082',
        },
        'oxford': '#05052C',
        'hunyadi-yellow': '#FBC571',
      },
    },
    plugins: [],
  },
};
