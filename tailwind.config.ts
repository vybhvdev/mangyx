import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
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
        accent: '#221e19', // Default to editorial ink color
        'accent-foreground': '#f5f2ec',
        'accent-hover': '#111010',
        'accent-soft': 'rgba(34, 30, 25, 0.05)',
        border: 'var(--border)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
