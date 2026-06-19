# AGENTS.md

Bun monorepo — Pelatform Toolkits. Turborepo orchestrates, Biome lints/formats, vitest tests.

## Commands

```bash
bun run build          # turbo build (dependsOn ^build)
bun run types:check    # turbo types:check (dependsOn ^build — build first)
bun run lint           # biome check + turbo lint
bun run lint:fix       # biome check --write --unsafe + turbo lint -- --fix
bun run format         # biome format --write
bun run test           # vitest run (NOT turbo — runs root vitest.config.ts directly)
bun run test:coverage  # vitest run --coverage (NOT turbo)
bun run clean          # turbo clean
bun run clean:all      # turbo clean:all + rm .husky .turbo bun.lock coverage node_modules

# Run one package's tests via vitest filter:
bun run test -- --run packages/email/test/email.test.ts
bun run test -- --run utils   # pattern match

# Or from a package directory:
cd packages/email && bun run test
```

## Architecture

All packages: ESM only, target ES2022, built with tsup (`dts: true`, `clean: true`, peerDeps auto-externalized).

- **`packages/email`** — Resend + Nodemailer. Exports: `.`, `./components`, `./helpers`. Peers: `react >=18`, `react-email >=6`, `resend >=6.9`, `nodemailer >=8`. **Cross-runtime**: all config/factory fns accept optional `EnvRecord` param. Nodemailer uses dynamic `await import()`. Resend works everywhere.
- **`packages/storage`** — S3/R2/MinIO/Spaces/Supabase + Cloudinary. Exports: `.`, `./s3`, `./cloudinary`, `./helpers`. **All peerDeps are optional**. S3/Cloudinary subpaths are Node-only (AWS SDK / Cloudinary SDK). Main index + helpers work cross-runtime. Config fns accept optional `EnvRecord`. Helpers use `Uint8Array` not `Buffer`, Web Crypto fallback for hashing.
- **`packages/utils`** — Client + server utilities. Exports: `.`, `./server` (server-only: JWT, bcrypt, node:crypto). Main entry safe cross-runtime — constants guard `process.env` via `typeof process`, browser functions have SSR guards. Server entry is Node/Bun/Deno only.
- **`packages/mcp`** — Private MCP server (not published). Built with `tsc`, not tsup. Ignored by changesets.
- **`packages/config/*`** — ESLint config packages use `tsc` to build (not tsup). Biome config ships as raw `.jsonc` files.

### Cross-runtime pattern

All 3 packages share the same `EnvRecord` pattern:

```typescript
export type EnvRecord = Record<string, string | undefined>;
```

Config/factory functions accept optional `env?: EnvRecord`. On Node/Bun defaults to `typeof process !== "undefined" ? process.env : undefined`. Other runtimes pass env explicitly.

## Testing

Root `vitest.config.ts` defines 3 projects (email, storage, utils), each with `environment: "node"`, `globals: true`, and a `setupFiles` pointing to `packages/*/test/setup.ts`.

Root `bun run test` runs vitest directly — bypasses turbo. This means tests do NOT get turbo's `dependsOn: ["^build"]`. Must build first if needed.

## Linting quirks

- Root `biome.jsonc` extends `@pelatform/biome-config/base` and **excludes test directories**: `"includes": ["!!**/test"]`. Biome skips test files entirely.
- `lint-staged` lives in root `package.json` (no separate config file): JS/TS → `biome check --write`, MD/YAML → `prettier --write`, JSON/HTML → `biome format --write`.

## Git hooks & commits

- Husky + lint-staged on pre-commit.
- Commitlint: `@commitlint/config-conventional` + `commitlint-plugin-function-rules`. Allowed types: `feat`, `feature`, `fix`, `refactor`, `docs`, `build`, `test`, `ci`, `chore`. `function-rules/header-max-length` disabled (no max header length).

## Publishing

```bash
bun run version   # changeset version && bun update
bun run release   # bash ./scripts/publish.sh
```

Changesets: `bumpVersionsWithWorkspaceProtocolOnly: true`, ignores `@pelatform/mcp.toolkits` + `@apps/*`. No auto-commit.

## Workspace protocol

Internal deps use `workspace:*` (exact match via Bun workspaces). `typescript` version is in the root `catalog` at `5.9.3`, consumed via `"typescript": "catalog:"`.
