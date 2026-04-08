import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        accent: '#f43f5e',
        'accent-hover': '#e11d48',
        'accent-soft': 'rgba(244, 63, 94, 0.1)',
        border: 'var(--border)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
