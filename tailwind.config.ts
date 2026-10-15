import typographyPlugin from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'

import typographyStyles from './typography'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  darkMode: 'selector',
  plugins: [typographyPlugin],
  theme: {
    fontSize: {
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '3.5rem' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    typography: typographyStyles,
    extend: {
      // Brand tokens from src/styles/tailwind.css. Extend only: the portal
      // still uses the zinc palette and must keep working unchanged.
      colors: {
        canvas: 'rgb(var(--bg) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        coral: 'rgb(var(--coral) / <alpha-value>)',
        // Not 'pink': that would replace Tailwind's pink scale, which
        // src/styles/prism.css uses for code highlighting.
        blush: 'rgb(var(--pink) / <alpha-value>)',
        lilac: 'rgb(var(--lilac) / <alpha-value>)',
        // Replaces teal as the site's link and highlight color. A static
        // scale so the existing 50 to 700 class names keep their meaning.
        accent: {
          50: '#fef3f1',
          100: '#fde4df',
          300: '#ff9a8a',
          400: '#ff6f5a',
          500: '#f0543f',
          600: '#d63f2b',
          700: '#b23222',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'Futura',
          'Century Gothic',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        serif: ['var(--font-serif)', 'Iowan Old Style', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'Menlo', 'monospace'],
        pixel: ['var(--font-pixel)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
} satisfies Config
