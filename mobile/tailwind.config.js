/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class', // Changed from 'media' to 'class'
  theme: {
    extend: {
      colors: {
        background: '#fff',
        primary: {
          DEFAULT: '#22c55e',
          foreground: '#fff',
          50: '#f0fdf5',
          100: '#dcfce8',
          200: '#bbf7d1',
          300: '#86efad',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803c',
          800: '#166533',
          900: '#14532b',
          950: '#052e14',
        },
        secondary: {
          DEFAULT: '#f8d364',
          foreground: '#fff',
          50: '#fefbec',
          100: '#fcf1c9',
          200: '#fae28d',
          300: '#f8d364',
          400: '#f5b92a',
          500: '#ef9911',
          600: '#d3740c',
          700: '#af510e',
          800: '#8e3f12',
          900: '#753412',
          950: '#431a05',
        },
        success: {
          DEFAULT: '#00d15c',
          50: '#E8F5E9',
          500: '#00d15c',
          800: '#2E7D32',
        },
        warning: {
          DEFAULT: '#FFC107',
          50: '#FFF8E1',
          500: '#FFC107',
          800: '#FF8F00',
        },
        error: {
          DEFAULT: '#e40744',
          50: '#FFEBEE',
          500: '#e40744',
          800: '#C62828',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        // Dark mode overrides
        dark: {
          border: 'hsl(0 0% 15%)',
          input: 'hsl(0 0% 12%)',
          background: 'hsl(0 0% 5%)',
          foreground: 'hsl(0 0% 100%)',

          card: {
            DEFAULT: 'hsl(0 0% 5%)',
            foreground: 'hsl(0 0% 95%)',
          },
        },
      },
      fontFamily: {
        sans: ['Inter-Regular', 'Helvetica', 'Arial', 'sans-serif'],
        normal: ['Inter-Regular', 'Helvetica', 'Arial', 'sans-serif'],
        medium: ['Inter-Medium', 'Helvetica', 'Arial', 'sans-serif'],
        bold: ['Inter-Bold', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['BadScript', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
