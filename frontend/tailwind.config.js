/** @type {import('tailwindcss').Config} */

/* eslint-disable */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
			animation: {
				'in': 'in 0.3s forwards',
				'out': 'out 0.3s forwards'
			},
      dropShadow: {
        lg: '4px 4px 16px rgba(0, 0, 0, 0.15)',
      },
      boxShadow: {
        light: '0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 0px 4px 0 rgba(0, 0, 0, 0.08)',
        strong: '0 2px 4px 0 rgba(0, 0, 0, 0.04), 2px 4px 16px 0 rgba(0, 0, 0, 0.12)',
				raised: '0 1px 2px 0 rgba(0, 0, 0, 0.24)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'radial-light':
          'radial-gradient(rgba(255,255,255,0.24), rgba(5, 5, 44, 0.24)), linear-gradient(#05052C, #05052C)',
        'radial-ultra-light':
          'radial-gradient(rgba(255,255,255,0.12), rgba(5, 5, 44, 0.12)), linear-gradient(#05052C, #05052C)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heebo: ['Heebo', ...defaultTheme.fontFamily.sans],
				ubuntu: ['Ubuntu', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        regular: '13px',
      },
      colors: {
        'crumpet-light': {
					50: '#FDFBF9',
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
        grey: {
					500: '#A7A198',
          700: '#7D766C',
          900: '#51493E',
        },
        oxford: '#05052C',
        'hunyadi-yellow': '#FBC571',
      },
    },
    plugins: [],
  },
};
