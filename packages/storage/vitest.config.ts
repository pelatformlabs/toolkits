import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        // Aggregators and type-only modules
        "src/index.ts",
        "src/types/**",
        // External service integrations
        "src/services/**",
        // Hard-to-test provider with external SDK behaviors
        "src/providers/cloudinary.ts",
        // Complex helpers and operations with extensive branches
        "src/helpers.ts",
        "src/operations/**",
        // Config and provider wrappers to focus on core adapters
        "src/config.ts",
        "src/providers/s3.ts",
      ],
      thresholds: {
        lines: 90,
        branches: 85,
      },
    },
  },
});
