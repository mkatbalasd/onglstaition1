const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["node_modules/**", "frontend/**"]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        console: true,
        process: true,
        __dirname: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        beforeAll: true,
        afterAll: true,
        jest: true
      }
    },
    ...js.configs.recommended,
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
];
