/** @type {import('tailwindcss').Config} */

// Kairo neutrals: a cool, slightly blue-black ink. Replaces Tailwind's slate/gray so every
// existing neutral utility lands on the brand ink without touching each component.
const ink = {
  50: '#f7f8fa',
  100: '#f0f1f4',
  200: '#e3e5ea',
  300: '#c9cdd5',
  400: '#9097a3',
  500: '#646b78',
  600: '#4a505b',
  700: '#343841',
  800: '#1f2229',
  900: '#13151a',
  950: '#0b0c10',
};

// Saffron: the single bright accent. 400 is the signature "moment" colour; 700+ are text-safe on white.
const saffron = {
  50: '#fff8eb',
  100: '#ffefcc',
  200: '#ffdd94',
  300: '#ffc95c',
  400: '#ffb224',
  500: '#f29a00',
  600: '#c97c00',
  700: '#9a5d00',
  800: '#7a4900',
  900: '#5c3700',
  950: '#3a2200',
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: ink,
        gray: ink,
        ink,
        brand: saffron,
      },
      boxShadow: {
        '2xs': '0 1px rgb(11 12 16 / 0.04)',
        xs: '0 1px 2px 0 rgb(11 12 16 / 0.06)',
        float: '0 1px 2px rgb(11 12 16 / 0.06), 0 12px 32px -12px rgb(11 12 16 / 0.18)',
        stage: '0 40px 100px -30px rgb(0 0 0 / 0.7)',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Funnel Display"', 'Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
