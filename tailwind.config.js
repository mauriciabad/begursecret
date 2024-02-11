// @ts-check

import { nextui } from '@nextui-org/react'
import typography from '@tailwindcss/typography'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config}*/
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      minHeight: {
        ...defaultTheme.minHeight,

        screen: /** @type {string} */ (
          /** @type {unknown} */ (['100vh', '100dvh'])
        ),
      },
      colors: {
        brand: {
          DEFAULT: '#5F797A',
          50: '#DBE3E1',
          100: '#CDD8D5',
          200: '#B0C2BF',
          300: '#94ABA9',
          400: '#779594',
          500: '#5F797A',
          600: '#4D6163',
          700: '#3B494C',
          800: '#293235',
          900: '#181C1E',
          950: '#0F1113',
        },
      },
      fontFamily: {
        title: [
          'var(--font-poppins)',
          'var(--font-inter)',
          ...defaultTheme.fontFamily.sans,
        ],
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        hover: 'hover 5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        wiggle: 'wiggle 10s -5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
      },
      keyframes: {
        hover: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(5%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(3deg)' },
          '50%': { transform: 'rotate(-3deg)' },
        },
      },
      screens: {
        xs: '475px',
        xs2: '375px',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui(),
    typography,
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'txt-stroke': (value) => ({
            textShadow: `
                0          0.1em    0 ${value},
               -0.0707em   0.0707em 0 ${value},
                0.0707em   0.0707em 0 ${value},
                0.1em      0        0 ${value},
               -0.1em      0        0 ${value},
               -0.0382em   0.0924em 0 ${value},
                0.0382em   0.0924em 0 ${value},
               -0.0923em   0.0383em 0 ${value},
                0.0923em   0.0383em 0 ${value},
                0         -0.1em    0 ${value},
               -0.0707em  -0.0707em 0 ${value},
                0.0707em  -0.0707em 0 ${value},
               -0.0382em  -0.0924em 0 ${value},
                0.0382em  -0.0924em 0 ${value},
               -0.0923em  -0.0383em 0 ${value},
                0.0923em  -0.0383em 0 ${value};
          `,
          }),
        },
        {
          values: theme('colors'),
          type: 'color',
        }
      )
    }),
  ],
}

export default config
