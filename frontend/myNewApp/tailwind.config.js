/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
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
        // Medical themed dark mode colors
        "dark-bg": "#121212",
        "dark-card": "#1E1E1E",
        "dark-accent": "#0096c7",
        "medical-teal": "#4CC9F0",
        "medical-navy": "#023E8A",
        "medical-light-blue": "#90E0EF",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card-hover': '0 10px 15px -3px rgba(0, 123, 255, 0.1), 0 4px 6px -2px rgba(0, 123, 255, 0.05)',
        'medical': '0 4px 6px -1px rgba(0, 119, 182, 0.1), 0 2px 4px -1px rgba(0, 119, 182, 0.06)',
        'medical-dark': '0 4px 6px -1px rgba(0, 150, 199, 0.2), 0 2px 4px -1px rgba(0, 150, 199, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'medical-pattern': "url('/medical-pattern.png')",
        'heart-monitor': "url('/heart-monitor.svg')",
      }
    },
  },
  plugins: [],
} 