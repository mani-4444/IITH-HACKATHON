/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#152a4e',
          600: '#1b365f',
        },
        teal: {
          500: '#14b8a6',
          400: '#2dd4bf',
          300: '#5eead4',
        },
        industrial: {
          dark: '#0d1b2a',
          mid: '#1b2838',
          card: '#1e293b',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
