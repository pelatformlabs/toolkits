---
"@pelatform/email": minor
---

Add cross-runtime support (Node.js, Bun, Cloudflare Workers, Deno, browser):

- `EnvRecord` pattern: all config/factory functions accept optional `env` parameter
- `process.env` access guarded via `typeof process !== "undefined"`
- NodemailerProvider uses dynamic `await import()` to prevent crashes in non-Node runtimes
- Attachment types: `Buffer` → `Uint8Array`
- `sendTemplate` now reuses `renderEmailTemplate` + `htmlToText` helpers
- Expanded test suite (132 → 169 tests): EnvRecord coverage, `validateResendEnvVars`, port/fallback var edge cases
- Updated README with per-runtime usage guides and compatibility table
