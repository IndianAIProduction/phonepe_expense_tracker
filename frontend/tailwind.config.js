/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        phonepe: {
          50: '#f5f0fb',
          100: '#ece1f7',
          200: '#dbc3f0',
          300: '#c39de5',
          400: '#a670d6',
          500: '#8c48c5',
          600: '#7534aa',
          700: '#5f259f', // Signature PhonePe purple
          800: '#4f2083',
          900: '#421c6b',
          950: '#2a0c47',
        },
        slate: {
          850: '#111827',
          900: '#0b0f19',
          950: '#070a11',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
