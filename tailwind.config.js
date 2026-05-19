// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This is the crucial line to add
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities, addBase }) {
      // Global scrollbar styles for entire website
      addBase({
        '*::-webkit-scrollbar': {
          width: '3px',
          height: '3px',
        },
        '*::-webkit-scrollbar-button': {
          display: 'none', // Remove arrow buttons
        },
        '*::-webkit-scrollbar-track': {
          'background-color': 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          'background': 'linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)',
          'border-radius': '20px',
          'transition': 'all 0.3s ease',
          'opacity': '0.5',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          'background': 'linear-gradient(180deg, #059669 0%, #047857 50%, #065f46 100%)',
          'opacity': '1',
        },
        '*::-webkit-scrollbar-corner': {
          'background-color': 'transparent',
        },
        '*': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#10b981 transparent',
        },
      });

      // Utility class for custom scrollbar
      const newUtilities = {
        '.scrollbar-thin::-webkit-scrollbar': {
          width: '3px',
          height: '3px',
        },
        '.scrollbar-thin::-webkit-scrollbar-button': {
          display: 'none',
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          'background-color': 'transparent',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          'background': 'linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)',
          'border-radius': '20px',
          'transition': 'all 0.3s ease',
          'opacity': '0.5',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
          'background': 'linear-gradient(180deg, #059669 0%, #047857 50%, #065f46 100%)',
          'opacity': '1',
        },
        '.scrollbar-thin:hover::-webkit-scrollbar-thumb': {
          'opacity': '0.7',
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#10b981 transparent',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover', 'dark']);
    },
  ],
}