---
"@pelatform/utils": patch
---

Add ULID-based time-sortable ID generation and a runtime-agnostic environment variable reader.

- **`baseId`** / **`baseIdCustom`**: new prefixed, time-sortable, ULID-compatible ID generators in `crypto/base-id` (uses `base-x` base32 encoding).
- **`getEnv`**: new cross-runtime env reader exported from the main entry — works across Bun, Node, Deno, and Workers without throwing.
- Refactored env access in `constants/development`, `constants/env`, and `functions/string/assets` to use `getEnv` for consistent cross-runtime behavior.
