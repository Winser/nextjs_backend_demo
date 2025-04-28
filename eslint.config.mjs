import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      quotes: ["error", "single"],
    }
  },

  globalIgnores(["dist", ".history"]),
]);