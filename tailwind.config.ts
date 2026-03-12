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
        paper: '#f5f2ec',
        onyx: '#111010',
        ink: {
          50:  '#faf9f6',
          100: '#eeece6',
          200: '#ddd9ce',
          300: '#c5bfb0',
          400: '#a89e8c',
          500: '#8f8270',
          600: '#756a5a',
          700: '#5e5448',
          900: '#423b33',
          950: '#221e19',
        },
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
