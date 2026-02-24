import { dirname } from "path";
import { fileURLToPath } from "url";
import pkg from "@eslint/eslintrc";

const { FlatCompat } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/next-env.d.ts",
      "**/src/generated/**", // Ignore generated Prisma client
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    settings: {
      tailwindcss: {
        callees: ["cn", "twMerge", "tv"],
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
