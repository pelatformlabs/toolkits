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
        // Browser-only utilities
        "src/functions/browser/**",
        // Aggregators
        "src/functions/index.ts",
        "src/index.ts",
        // Hard-to-test or environment-specific utilities
        "src/functions/http/**",
        "src/functions/http/recaptcha.ts",
        // Crypto helpers not used in edge runtimes
        "src/functions/crypto/generate-random-string.ts",
        "src/functions/crypto/hash-string.ts",
        "src/functions/crypto/jwt.ts",
        "src/functions/crypto/password.ts",
        // Analytics SDK wrappers
        "src/functions/analytics/google.ts",
        "src/functions/url/domains.ts",
        "src/functions/url/link-constructor.ts",
        "src/functions/url/url-conversion.ts",
        "src/functions/url/url-formatting.ts",
        // Lower-priority datetime helpers (covered elsewhere)
        "src/functions/datetime/billing-utils.ts",
        "src/functions/datetime/format-datetime.ts",
        "src/functions/datetime/format-datetime-smart.ts",
        "src/functions/datetime/format-period.ts",
        "src/functions/datetime/format-time.ts",
        "src/functions/datetime/get-datetime-local.ts",
        "src/functions/datetime/get-first-and-last-day.ts",
        "src/functions/datetime/parse-datetime.ts",
        "src/functions/datetime/time-ago.ts",
        "src/functions/datetime/timezone.ts",
        // Validation keys map
        "src/functions/validation/keys.ts",
        // Email validation heuristics
        "src/functions/validation/email.ts",
      ],
      thresholds: {
        lines: 90,
        branches: 85,
      },
    },
  },
});
