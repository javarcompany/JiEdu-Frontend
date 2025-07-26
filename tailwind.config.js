/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-gradient-to-r", // explicitly include the gradient direction
    {
      pattern: /from-(red|green|blue|purple|yellow|pink|indigo|orange|rose|teal|cyan|amber|lime|emerald|violet|fuchsia|sky|stone|gray|zinc|neutral|slate)-\d{2,3}/,
    },
    {
      pattern: /to-(red|green|blue|purple|yellow|pink|indigo|orange|rose|teal|cyan|amber|lime|emerald|violet|fuchsia|sky|stone|gray|zinc|neutral|slate)-\d{2,3}/,
    },
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
