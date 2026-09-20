import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
  environment: "jsdom",
  setupFiles: ["./vitest.setup.ts"],
  globals: true,

  include: [
    "__tests__/**/*.{test,spec}.{ts,tsx}",
  ],

  exclude: [
    "e2e/**",
    "node_modules/**",
    ".next/**",
    "playwright-report/**",
    "test-results/**",
  ],
},
});
