# CLAUDE.md

This guide describes how development tools should interact with the code in this repository.

## Project Overview

This is a Bun-based monorepo for Pelatform Toolkits, containing utility packages for SaaS applications. The repository uses Turborepo for task orchestration and Biome for linting/formatting.

## Tech Stack

- **Package Manager**: Bun (v1.3.3+)
- **Monorepo Tool**: Turborepo (v2.6.1)
- **Build Tool**: tsup (for package bundling)
- **Linting/Formatting**: Biome (v2.3.7)
- **Language**: TypeScript 5.9.3
- **Node Version**: >=22

## Common Commands

### Development

```bash
bun run dev                # Run all packages (watch mode)
bun run build              # Build all packages
bun run types:check        # Type-check all packages
```

### Linting and Formatting

```bash
bun run lint               # Lint with safe auto-fixes
bun run lint:fix           # Lint with comprehensive (unsafe) fixes
bun run format             # Format code
bun run format:check       # Check format and fix when needed
```

### Package Management

```bash
bun install                # Install dependencies
bun run clean              # Clean build outputs
bun run clean:all          # Deep clean (.turbo, bun.lock, node_modules)
```

### Publishing (maintainers)

```bash
bun run version            # Update versions using Changesets
bun run release            # Build and publish packages to npm
```

### Individual Package Development

```bash
cd packages/email && bun run dev       # Develop email package with watch mode
cd packages/email && bun run build     # Build specific package
cd packages/email && bun run types:check  # Type-check specific package
```

## Repository Structure

```
.
├── packages/
│   ├── email/          # Email (Resend, Nodemailer)
│   ├── storage/        # Storage (S3, Cloudinary, R2, MinIO, etc.)
│   ├── utils/          # Common utilities
│   └── config/
│       ├── biome/      # Biome configuration
│       └── tsconfig/   # TypeScript configuration
└── apps/               # Optional (currently empty)
```

## Package Architecture

### @pelatform/email

- **Purpose**: Email template system and sending utilities
- **Providers**: Resend (default), Nodemailer (SMTP)
- **Key Dependencies**: @react-email/components, resend, nodemailer
- **Exports**: Main exports, `/components`, `/helpers`
- **Peer Dependencies**: react >=18.0.0

### @pelatform/storage

- **Purpose**: Unified storage interface for multiple cloud providers
- **Providers**: AWS S3, Cloudflare R2, MinIO, DigitalOcean Spaces, Supabase Storage, Cloudinary
- **Exports**: Main exports, `/s3`, `/cloudinary`, `/helpers`
- **Peer Dependencies**: Optional - @aws-sdk/client-s3, cloudinary (install only what you need)

### @pelatform/utils

- **Purpose**: Comprehensive utility functions for SaaS applications
- **Categories**: string, url, datetime, crypto, validation, browser, array, analytics
- **Exports**: Main exports, `/server` (for server-only utilities)
- **Key Features**: JWT handling, password hashing, slugification, URL utilities, date parsing/formatting

### @pelatform/biome-config

- **Purpose**: Consistent configuration for Biome lint/format
- **Usage**: Extend in projects/packages to standardize style

### @pelatform/tsconfig

- **Purpose**: Extendable TypeScript configurations
- **Notes**: Consumers override `rootDir`, `outDir`, and `include` to match their structure

## Build Configuration

All packages use:

- **tsup** for bundling (via `tsup.config.ts`)
- **ESM only** (no CommonJS)
- **Target**: ES2022
- **Multiple entry points** for tree-shaking

## Code Style

Biome is configured with:

- **Indentation**: 2 spaces
- **Line Width**: 100 characters
- **Quotes**: Single quotes for JS/TS, single quotes for CSS
- **Semicolons**: Always
- **Trailing Commas**: All
- **Import Sorting**: Enabled with custom groups (React/Next first, then packages, then @pelatform/\*, then relative imports)

Notable rules:

- Most a11y rules are disabled
- `noExplicitAny` is set to warn
- `useSortedClasses` is enabled for Tailwind (with `cn()` function)

## Turborepo Tasks

- **build**: Builds packages with dependency awareness
- **dev**: Runs development mode (persistent)
- **start**: Starts production mode (requires build)
- **types:check**: TypeScript type checking
- **clean/clean:all**: Cleanup tasks (no cache)

## TypeScript Configuration

All packages share similar tsconfig patterns:

- **Module**: ESNext
- **Strict**: Enabled
- **Target**: ES2022
- **Declaration**: Generated automatically

## Publishing

Packages are published to npm with public access:

- Package names: `@pelatform/email`, `@pelatform/storage`, `@pelatform/utils`, `@pelatform/biome-config`, `@pelatform/tsconfig`
- Versioning: Managed via Changesets
- Build artifacts: `dist/` directory only

## Development Workflow

1. Make changes in `packages/*/src/`
2. Run `bun run dev` in the relevant package (watch mode)
3. Run `bun run types:check` to verify types
4. Run `bun run lint:format` before committing
5. For publishing: update changesets, then `bun run version` and `bun run release`

## Important Notes

- All packages are ESM-only (no CommonJS support)
- Storage package has optional peer dependencies — consumers only install what they need
- Email package requires React as a peer dependency
- Utils package has both client and server exports (`/server` for Node.js-only utilities)
- The `apps/` directory is optional and currently empty
