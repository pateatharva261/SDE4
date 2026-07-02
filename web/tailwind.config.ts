import type { Config } from 'tailwindcss';

const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{ts,tsx,mdx}', './content/**/*.{md,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: { center: true, padding: '1.5rem' },
    extend: {
      colors: {
        bg:       rgb('--bg'),
        'bg-elev':  rgb('--bg-elev'),
        'bg-elev2': rgb('--bg-elev2'),
        border:   rgb('--border'),
        text:     rgb('--text'),
        'text-dim': rgb('--text-dim'),
        accent:   rgb('--accent'),
        'accent-2': rgb('--accent-2'),
        warn:     rgb('--warn'),
        done:     rgb('--done'),
        planned:  rgb('--planned'),
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // matched to current values
        'lesson-h1': ['30px', { lineHeight: '1.25' }],
        'lesson-h2': ['22px', { lineHeight: '1.35' }],
        'lesson-h3': ['17.5px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
        sm: 'var(--shadow-sm)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--glow-accent)',
      },
      backdropBlur: { xs: '2px' },
      keyframes: {
        'fade-in':   { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up':  { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'flip':      { '0%': { transform: 'rotateY(0deg)' }, '100%': { transform: 'rotateY(180deg)' } },
        'shimmer':   { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
      animation: {
        'fade-in':  'fade-in var(--dur-base) var(--ease-out-quart)',
        'slide-up': 'slide-up var(--dur-slow) var(--ease-out-quart)',
        'shimmer':  'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
} satisfies Config;
