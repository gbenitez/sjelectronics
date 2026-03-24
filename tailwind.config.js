/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: {
            50: '#FFF1F1',
            100: '#FFE0E0',
            200: '#FFC2C2',
            300: '#FF9494',
            400: '#FF5C5C',
            500: '#D3151E',
            600: '#B80F16',
            700: '#930C12',
            800: '#74090E',
            900: '#4E0508',
          },
          secondary: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#2563EB',
            600: '#1D4ED8',
            700: '#1E40AF',
            800: '#1E3A8A',
            900: '#172554',
          }
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1F2937',
          900: '#0B1220',
        }
      },
      fontFamily: {
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        ultraWide: '0.12em',
        poster: '0.18em',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(2, 6, 23, 0.06)',
        'md': '0 6px 16px rgba(2, 6, 23, 0.10)',
        'lg': '0 18px 40px rgba(2, 6, 23, 0.14)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
        'pill': '999px',
      },
    },
  },
  plugins: [],
}
