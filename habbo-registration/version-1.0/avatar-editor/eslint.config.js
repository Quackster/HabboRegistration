// @ts-check
// ESLint flat config — SolidJS + TypeScript + JSX accessibility.
//
// Old: No ESLint configuration.
// New: Flat config with eslint recommended, typescript-eslint recommended,
//   eslint-plugin-solid for SolidJS reactivity/JSX rules, eslint-plugin-jsx-a11y
//   for accessibility. Integrated with Vite dev server via vite-plugin-eslint2.

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    ...solid.configs['flat/typescript'],
  },
  {
    files: ['src/**/*.tsx'],
    ...jsxA11y.flatConfigs.recommended,
  },
  { ignores: ['dist/', 'demo/dist/', 'node_modules/'] },
);
