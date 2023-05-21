module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ["jest", 'prettier', '@typescript-eslint', "react", "react-hooks", "testing-library"],
  settings: {
    "react": {
      "version": "detect"
    }
  },
  rules: {
    'no-console': ['error'],
    'no-shadow': ['error'],
    'max-len': ['error', { code: 120 }],
    "@typescript-eslint/ban-ts-comment": "off",
    "react/react-in-jsx-scope": "off",
  },
  globals: {
    afterEach: false,
    beforeEach: false,
    describe: false,
    document: false,
    expect: false,
    fetch: false,
    it: false,
    jest: false,
    window: false,
    __DEV__: false,
  },
  env: {
    "jest/globals": true,
  },
  ignorePatterns: ['*.d.ts', 'build', 'node_modules'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
