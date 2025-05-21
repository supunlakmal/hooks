module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'plugin:jsx-a11y/recommended', // Added this line
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest', 'jsx-a11y'], // Added 'jsx-a11y'
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    "react/react-in-jsx-scope": "off",
    // Note: The original rule for "react/jsx-filename-extension" was duplicated. I'm keeping the more inclusive one.
  },
};
