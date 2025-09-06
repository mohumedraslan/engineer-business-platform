import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/.vscode/**",
      "**/next-env.d.ts",
    ],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-console": "warn",
      "no-unused-vars": "warn",
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
];

export default config;
