import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ember: '#FF5722',
        emberDark: '#FF6600',
        cream: '#FDFBF7',
        charcoal: '#1E1E1E',
      },
      boxShadow: {
        glow: '0 12px 40px rgba(255, 102, 0, 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config;
