/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/widget/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        legal: {
          navy: '#0f223f',
          navyDeep: '#0a1730',
          navySoft: '#1d3457',
          cream: '#f8f6f1',
          card: '#fffdf8',
          gold: '#b18a42',
          goldSoft: '#d8c39a',
          border: '#d9d2c3',
          text: '#1d2b42',
          muted: '#5f6b7f',
          panel: '#f1ede3',
          success: '#1f6a4d',
          warning: '#7b4d2a',
        },
      },
      fontFamily: {
        display: ['"Merriweather"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        legal: '0 8px 24px rgba(15, 34, 63, 0.08)',
        panel: '0 4px 16px rgba(15, 34, 63, 0.06)',
      },
      keyframes: {
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'skeleton-shift': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'card-in': 'card-in 240ms ease-out',
        'skeleton-shift': 'skeleton-shift 1.25s linear infinite',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
