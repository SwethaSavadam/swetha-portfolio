/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { 
        sans: ['Inter','system-ui','-apple-system','Segoe UI','Roboto','Arial','sans-serif'],
        digital: ['VT323','ui-monospace','SFMono-Regular','Menlo','monospace'],
      },
      colors: { accent: '#ff6b9a', ink: '#0f172a' },
      boxShadow: {
        innerSoft: 'inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -3px 0 rgba(0,0,0,0.12)',
        card: '0 12px 24px rgba(2,6,23,0.10)'
      }
    }
  },
  plugins: [],
}
