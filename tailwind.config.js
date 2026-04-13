/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0F0F14',
          card: '#1A1A24',
          input: '#24243A',
        },
        accent: {
          green: '#00E5A0',
          red: '#FF4D6D',
          purple: '#8B5CF6',
          blue: '#38BDF8',
        },
        muted: '#6B6B8A',
        border: '#2D2D45',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};
