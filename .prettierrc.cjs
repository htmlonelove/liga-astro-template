/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    },
    {
      files: ['**/*.scss'],
      options: {
        singleQuote: false
      }
    }
  ],
  singleQuote: true,
  quoteProps: 'consistent',
  semi: false,
  trailingComma: 'none',
  jsxSingleQuote: false,
  bracketSpacing: true,
  arrowParens: 'always',
  singleAttributePerLine: false,
  bracketSameLine: false,
  printWidth: 80
}
