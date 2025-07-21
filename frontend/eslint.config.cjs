const js = require('@eslint/js');
const vue = require('eslint-plugin-vue');
const parser = require('vue-eslint-parser');

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        fetch: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        process: 'readonly',
        module: 'writable',
        require: 'readonly'
      }
    },
    ...js.configs.recommended
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        fetch: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        process: 'readonly',
        module: 'writable',
        require: 'readonly'
      }
    },
    plugins: {
      vue
    },
    rules: {}
  }
];
