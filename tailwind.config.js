/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#C1121F',
        light: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#0F172A',
          secondary: '#1E293B',
          accentSoft: '#FCA5A5',
        },
        dark: {
          bg: '#0B1120',
          card: '#111827',
          text: '#F8FAFC',
          accent: '#E11D48',
          border: '#334155',
        },
      },
      backgroundImage: {
        heroEmergency: 'linear-gradient(135deg, #0F172A 0%, #7F1D1D 52%, #C1121F 100%)',
      },
      boxShadow: {
        heroCard: '0 24px 60px rgba(15, 23, 42, 0.12)',
      },
      fontFamily: {
        sans: ['"Reddit Mono"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
