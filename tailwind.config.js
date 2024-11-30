/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bnet: {
          blue: {
            DEFAULT: '#148EFF',
            50: '#E6F3FF',
            100: '#CCE7FF',
            200: '#99CFFF',
            300: '#66B7FF',
            400: '#339FFF',
            500: '#148EFF',
            600: '#0070DB',
            700: '#0054A3',
            800: '#00386C',
            900: '#001C34'
          },
          gray: {
            50: '#F0F1F2',
            100: '#E1E3E6',
            200: '#C4C7CD',
            300: '#A6ABB4',
            400: '#898F9B',
            500: '#6B7382',
            600: '#4D5562',
            700: '#2F3742',
            800: '#1B2028',
            900: '#0D1014',
            950: '#070809'
          }
        }
      },
      keyframes: {
        'tooltip-enter-top': {
          '0%': { opacity: '0', transform: 'translate(-50%, -0.5rem)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' }
        },
        'tooltip-enter-right': {
          '0%': { opacity: '0', transform: 'translate(-0.5rem, -50%)' },
          '100%': { opacity: '1', transform: 'translate(0, -50%)' }
        },
        'tooltip-enter-bottom': {
          '0%': { opacity: '0', transform: 'translate(-50%, 0.5rem)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' }
        },
        'tooltip-enter-left': {
          '0%': { opacity: '0', transform: 'translate(0.5rem, -50%)' },
          '100%': { opacity: '1', transform: 'translate(0, -50%)' }
        }
      },
      animation: {
        'tooltip-enter-top': 'tooltip-enter-top 0.2s ease-out',
        'tooltip-enter-right': 'tooltip-enter-right 0.2s ease-out',
        'tooltip-enter-bottom': 'tooltip-enter-bottom 0.2s ease-out',
        'tooltip-enter-left': 'tooltip-enter-left 0.2s ease-out'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  darkMode: 'class'
} 