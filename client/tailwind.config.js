/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1769E0',
          light: '#2E8CFF',
          dark: '#0D4A9E',
          50: '#E8F1FF',
          100: '#D1E3FF',
          200: '#A3C7FF',
          300: '#75ABFF',
          400: '#478FFF',
          500: '#1769E0',
          600: '#1254B3',
          700: '#0D3F86',
          800: '#082A5A',
          900: '#04152D',
        },
        chip: {
          bg: '#E8F1FF',
        },
        bg: '#F5F7FA',
        text: {
          dark: '#111111',
          muted: '#555555',
          light: '#888888',
        },
        border: '#E5E7EB',
        highlight: '#F7C948',
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#059669',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'card': '12px',
        'button': '10px',
        'chip': '20px',
        'input': '10px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'large': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}