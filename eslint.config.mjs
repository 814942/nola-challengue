// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': ['error'],
      '@typescript-eslint/no-unsafe-assignment': ['error'],
      '@typescript-eslint/no-unsafe-call': ['error'],
      '@typescript-eslint/no-unsafe-member-access': ['error'],
      '@typescript-eslint/no-unsafe-return': ['error'],
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-var-requires': ['error'],
      '@typescript-eslint/no-empty-function': ['error'],
      '@typescript-eslint/no-empty-interface': ['error'],
      '@typescript-eslint/no-inferrable-types': ['error'],
      '@typescript-eslint/no-non-null-assertion': ['error'],
      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/no-unsafe-argument': ['error'],
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiterals: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          enforceConst: true,
          detectObjects: true
        }
      ],

      // Mejores prácticas
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'array-callback-return': ['error'],
      'no-debugger': ['error'],
      'no-unused-vars': ['error'],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'no-implicit-globals': ['error'],
      'no-implicit-coercion': ['error'],
      'no-useless-constructor': ['error'],
      'no-useless-return': ['error'],
      'no-trailing-spaces': ['error'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-unreachable': ['error'],
      'no-void': ['error'],
      'no-unexpected-multiline': ['error'],
      'no-constant-condition': ['error'],
      'semi': ['error'],
      'no-template-curly-in-string': ['error'],
      'no-extra-semi': ['error'],
      'no-unneeded-ternary': ['error'],
      'no-array-constructor': ['error'],
      'no-new-object': ['error'],
      'no-new-wrappers': ['error'],
      'no-new-symbol': ['error'],
      'no-new-func': ['error'],
      'no-new': ['error'],
      'no-useless-computed-key': ['error'],
      'no-useless-concat': ['error'],
      'no-useless-escape': ['error'],
      'no-useless-rename': ['error'],
      'no-useless-call': ['error'],
      'no-useless-catch': ['error'],
      'no-useless-wrap': ['error'],
      'no-useless-typeof': ['error'],
      'no-use-before-define': ['error'],
      'no-unused-expressions': ['error'],
      'no-unused-labels': ['error'],
      'no-unused-private-class-members': ['error']
    }
  }
);