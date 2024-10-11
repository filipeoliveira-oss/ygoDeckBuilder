/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        '16': 'repeat(16, minmax(0, 1fr))',

        // Complex site-specific column configuration
        'cards': 'repeat(auto-fit, 10rem)',

        'brackets': 'repeat(auto-fit, minmax(13rem, 1fr))',
      }
    },
    keyframes:{
      showBorder:{
        '100%': {width:'100%'}
      }
    },
    animation:{
      showBorder: 'showBorder 200ms ease-in-out forwards'
    }
  },
  plugins: [
    
  ],
}