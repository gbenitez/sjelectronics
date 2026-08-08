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
        // Paleta institucional SJ Electronics: negro, rojo, blanco.
        // El rojo es acento (CTAs, subrayados, estado activo), nunca fondo de pantalla completa.
        sj: {
          black: '#0A0A0A',
          graphite: '#1A1A1C',
          red: '#B00711',
          redBright: '#E10600',
          white: '#FFFFFF',
          offWhite: '#F7F6F4',
        },
        brand: {
          // Rojo institucional. 600 = #B00711 (marca), 500 = #E10600 (acento vivo / estados activos).
          primary: {
            50: '#FFF1F1',
            100: '#FFDCDC',
            200: '#FFB4B4',
            300: '#FF8080',
            400: '#F53D3D',
            500: '#E10600',
            600: '#B00711',
            700: '#8C0710',
            800: '#66050C',
            900: '#3D0308',
          },
          // Escala neutra negra: reemplaza el turquesa anterior en focus-rings, checkboxes,
          // switches y enlaces secundarios. Sin segundo color de marca.
          secondary: {
            50: '#F7F6F4',
            100: '#EDEBE7',
            200: '#D8D5D0',
            300: '#B8B4AD',
            400: '#8C8880',
            500: '#5C5954',
            600: '#3A3836',
            700: '#242220',
            800: '#1A1A1C',
            900: '#0A0A0A',
          }
        },
        // Escala neutra cálida (blanco cálido F7F6F4) en vez del gris azulado anterior.
        // neutral-950 hereda el valor por defecto de Tailwind (#0A0A0A == sj.black).
        neutral: {
          0: '#FFFFFF',
          50: '#F7F6F4',
          100: '#EEECE9',
          200: '#DFDCD7',
          300: '#C7C3BC',
          400: '#9C978E',
          500: '#6E6A63',
          600: '#4A4743',
          700: '#333130',
          800: '#1A1A1C',
          900: '#141416',
        }
      },
      fontFamily: {
        // Display: geometría bold/italic que dialoga con el isotipo. Cuerpo: lectura cómoda.
        display: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
