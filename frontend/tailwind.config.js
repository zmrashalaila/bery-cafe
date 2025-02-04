/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelPink: '#fee3e2',  // Soft pink
        pastelRed: '#da0328',    // Slightly muted red
        pastelDarkRed: '#b7122d', // Darker pastel red
        pastelRose: '#c44c5e',    // Pastel rose
        pastelLightPink: '#f5a1ac',
        cream: '#A79C83' // Light pastel pink
      },
    },
  },
  plugins: [],
};
