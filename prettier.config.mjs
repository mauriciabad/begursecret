/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'es5',
  semi: false,
  singleQuote: true,
  tailwindConfig: './tailwind.config.js',
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
