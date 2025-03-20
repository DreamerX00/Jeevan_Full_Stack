/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0077B6", // Medical blue
        secondary: "#48CAE4", // Light blue
        accent: "#00B4D8", // Bright blue
        neutral: "#F8F9FA", // Light gray
        "neutral-dark": "#6C757D", // Dark gray
        success: "#20C997", // Teal green
        warning: "#FFC107", // Amber
        danger: "#DC3545", // Red
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 