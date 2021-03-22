module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript'],
  env: {
    node: true,
  },
  globals: {
    Deno: false,
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
  },
};
