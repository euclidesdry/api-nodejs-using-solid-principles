import unusedImports from "eslint-plugin-unused-imports";

export default [{
  plugins: {
    "unused-imports": unusedImports
  },
  extends: [
    "@rocketseat/eslint-config/node"
  ],
  rules: {
    "camelcase": "warn",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
      },
    ]
  }
}]