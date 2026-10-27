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
        canvas: '#0E0E11',
        card: {
          DEFAULT: '#18181D',
          elevated: '#222228',
          subtle: '#2C2C34',
        },
        hairline: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.16)',
        },
        ios: {
          green: '#34C759',
          red: '#FF453A',
          blue: '#0A84FF',
          orange: '#FF9F0A',
          yellow: '#FFD60A',
          purple: '#BF5AF2',
          gray: {
            1: '#8E8E93',
            2: '#636366',
            3: '#48484A',
            4: '#3A3A3C',
            5: '#2C2C2E',
            6: '#1C1C1E',
          }
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          'sans-serif',
        ],
      },
      borderRadius: {
        'squircle-sm': '14px',
        'squircle': '18px',
        'squircle-lg': '24px',
        'squircle-xl': '28px',
      },
      boxShadow: {
        'hairline': '0 0 0 1px rgba(255, 255, 255, 0.08)',
        'hairline-strong': '0 0 0 1px rgba(255, 255, 255, 0.16)',
      }
    },
  },
  plugins: [],
}
