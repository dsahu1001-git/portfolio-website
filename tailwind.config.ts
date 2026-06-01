import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#00F5FF',
          foreground: '#021315',
        },
        accent: {
          DEFAULT: '#F59E0B',
          foreground: '#000000',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(2, 8, 23, 0.34)',
        signal:
          '0 0 0 1px rgba(0, 245, 255, 0.16), 0 18px 70px rgba(0, 245, 255, 0.1)',
      },
    },
  },
  plugins: [typography],
};

export default config;
