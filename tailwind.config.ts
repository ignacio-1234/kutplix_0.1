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
        primary: {
          DEFAULT: '#2E75B6',
          dark: '#235a8c', // Darker shade of #2E75B6
          light: '#D5E8F0',
        },
        secondary: '#D5E8F0',
        success: '#4CAF50',
        warning: '#FF9800',
        danger: '#f44336',
        neutral: {
          light: '#F5F5F5',
          dark: '#333333',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
