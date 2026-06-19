---
"@pelatform/storage": minor
---

Add cross-runtime support (Node.js, Bun, Cloudflare Workers, Deno, browser):

- `EnvRecord` pattern: all config functions accept optional `env` parameter
- `process.env` guarded at module level; removed top-level side effect in `s3.ts`
- Helpers now use `Uint8Array` instead of `Buffer`, Web Crypto API fallback for hashing
- `base64ToBuffer` / `bufferToBase64` use `atob`/`btoa` when Buffer unavailable
- `detectFileTypeFromContent` uses `TextDecoder` and `Uint8Array` comparison
- Deleted dead `factory.ts` (all comments, no active code)
- Updated README with runtime compatibility table and `EnvRecord` docs
