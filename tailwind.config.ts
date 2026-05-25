import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#9B4A2F',
          light: '#B85C3A',
          dark: '#7A3A24',
        },
        gold: {
          DEFAULT: '#D4A574',
          light: '#E8C49A',
          dark: '#B8894E',
        },
        espresso: {
          DEFAULT: '#2A1810',
          light: '#3D2418',
          dark: '#1A0E08',
        },
        ivory: {
          DEFAULT: '#F5EFE0',
          light: '#FAF7F0',
          dark: '#EAE0CC',
        },
        jade: {
          DEFAULT: '#2D5F4E',
          light: '#3A7A63',
          dark: '#1E4034',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'zoom-slow': 'zoomSlow 20s ease-in-out infinite alternate',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        zoomSlow: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
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

export default config
