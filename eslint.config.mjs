// ESLint flat config (v9+) — extends templates/linting/eslint.config.mjs.template
// with typescript-eslint so TypeScript sources parse and get typed-code rules.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off', // superseded by the TS-aware rule below
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/', 'coverage/'],
  },
);
