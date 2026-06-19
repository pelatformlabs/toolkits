---
"@pelatform/utils": minor
---

Improve cross-runtime safety for all environments:

- Constants (`development.ts`, `env.ts`, `assets.ts`): use guarded `process.env` access (`typeof process !== "undefined"`)
- Browser functions: add SSR guards in `getHeight`, `resizeImage`, `loadImage`
- Fix `NodeJS.Timeout` → `ReturnType<typeof setTimeout>` in `debounce.ts`
- Delete dead files: `constants/main.ts`, `browser/is-click-on-interactive-child.ts`, `string/punycode.ts`, `string/translations.ts`
- Clean stale JSDoc references to deleted modules in `link-constructor.ts`
- Updated README with runtime compatibility section
