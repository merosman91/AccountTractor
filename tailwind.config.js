/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf0dc',
          200: '#bce2bc',
          300: '#90ce90',
          400: '#5db25d',
          500: '#3d943d',
          600: '#2e7d32',
          700: '#256328',
          800: '#215024',
          900: '#1c421f',
        },
        accent: {
          50: '#fff8f0',
          100: '#ffefd6',
          200: '#ffdcad',
          300: '#ffc178',
          400: '#ff9a3f',
          500: '#ff7b1c',
          600: '#f57c00',
          700: '#cc5c00',
          800: '#a34a02',
          900: '#843e0a',
        },
      },
      fontFamily: {
        arabic: ['"Noto Sans Arabic"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
