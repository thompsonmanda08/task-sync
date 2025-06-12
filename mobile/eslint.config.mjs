import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.mjs'],
        },
      },
    },

    plugins: {
      react,
      'unused-imports': unusedImports,
      prettier,
    },

    rules: {
      'no-undef': 'error', // Errors on undefined variables
      'import/no-unresolved': 'warn', // Errors on unresolved imports
      // "no-console": "warn", // No Console logs in code base
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto', // This will maintain existing line endings
          trailingComma: 'all', // Add this line to allow trailing commas
        },
      ],
      'no-unused-vars': [
        'warn',
        { args: 'after-used', ignoreRestSiblings: true },
      ],
      'unused-imports/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'warn',

      'import/order': [
        'error',
        {
          groups: [
            'type',
            'builtin',
            'object',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          distinctGroup: true,
          named: false,
          warnOnUnassignedImports: false,
        },
      ],
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
    },
  },
];

export default eslintConfig;
