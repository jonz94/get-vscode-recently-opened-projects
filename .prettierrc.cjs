/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 80,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',

  plugins: [
    require('prettier-plugin-packagejson'),
    require('prettier-plugin-organize-imports'),
  ],

  overrides: [
    {
      files: '**/*.json',
      options: {
        printWidth: 1,
      },
    },
  ],
}
