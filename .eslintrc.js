// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'standard-with-typescript'
  ],
  rules: {
    'no-void': 0,
    '@typescript-eslint/no-redeclare': ['off']
  },
  parserOptions: {
    project: './tsconfig.json',
    strictNullChecks: true,
    strictPropertyInitialization: true,
    createDefaultProgram: true
  }
}
