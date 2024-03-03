import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        pulse1: {
          '0%, 100%': { opacity: 0 as any },
          '50%': { opacity: 1 as any },
        },
        pulse2: {
          '0%, 100%': { opacity: 0 as any },
          '50%': { opacity: 1 as any },
        },
        pulse3: {
          '0%, 100%': { opacity: 0 as any },
          '50%': { opacity: 1 as any },
        },
        wave: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.10)' },
        },
        // Add as many pulses as needed
      },
      animation: {
        pulse1: 'pulse1 1s infinite',
        pulse2: 'pulse2 1s infinite',
        pulse3: 'pulse3 1s infinite',
        wave: 'wave 2s ease-in-out infinite'
        // Corresponding animations for each keyframe
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
