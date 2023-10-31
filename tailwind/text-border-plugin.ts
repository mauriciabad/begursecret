import plugin from 'tailwindcss/plugin'

const textBorder = plugin(function ({ matchUtilities, theme, config }) {
  const textBorderWidth = `--tw${config('prefix')}-text-border-width`
  const pos = `var(${textBorderWidth},1px)`
  const neg = `calc(var(${textBorderWidth}, 1px) * -1)`

  matchUtilities(
    {
      'text-border': (value) => ({
        'text-shadow': `
            ${pos} ${pos} 0 ${value},
            ${neg} ${neg} 0 ${value},
            ${pos} ${neg} 0 ${value},
            ${neg} ${pos} ${value};
          `,
      }),
    },
    {
      values: { white: 'white', black: 'black' } as const,
      type: ['color', 'any'],
    }
  )

  matchUtilities(
    {
      'text-border': (value) => ({
        [textBorderWidth]: value,
      }),
    },
    { values: theme('borderWidth') }
  )
})

export default textBorder
