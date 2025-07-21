const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["node_modules/**", "frontend/**"]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs"
    },
    ...js.configs.recommended
  }
];
