/// <reference types="vitest" />
/// <reference types="vite" />

// eslint-disable-next-line import/no-extraneous-dependencies
import typescript from "@rollup/plugin-typescript";
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: "src/html.ts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      plugins: [
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
          exclude: ["**/*.test.ts"],
        }),
      ],
    },
  },
  test: {},
});
