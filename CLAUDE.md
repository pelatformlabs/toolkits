# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Bun-based monorepo for Pelatform Toolkits, containing utility packages for SaaS applications. The repository uses Turborepo for task orchestration and Biome for linting/formatting.

## Tech Stack

- **Package Manager**: Bun 1.3.5
- **Monorepo Tool**: Turborepo 2.7.2
- **Build Tool**: tsup (for package bundling), tsc (for ESLint configs)
- **Linting/Formatting**: Biome 2.3.10
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

### Testing

```bash
bun run test               # Run all tests
bun run test:watch         # Run tests in watch mode
bun run test:coverage      # Run tests with coverage report
cd packages/email && bun run test         # Run tests for specific package
cd packages/storage && bun run test:coverage  # Run coverage for specific package
```

**Note**: Root `vitest.config.ts` configures separate test projects for each package (email, storage, utils) with their respective setup files in `packages/*/test/setup.ts`.

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
cd packages/email && bun run test      # Test specific package
```

## Repository Structure

```
.
├── packages/
│   ├── email/          # Email (Resend, Nodemailer)
│   ├── storage/        # Storage (S3, Cloudinary, R2, MinIO, etc.)
│   ├── utils/          # Common utilities
│   ├── mcp/           # MCP server for documentation (private)
│   └── config/
│       ├── biome/               # Biome configuration
│       ├── eslint-config/       # Base ESLint configuration
│       ├── eslint-config-react/ # React ESLint configuration
│       ├── eslint-config-vite/  # Vite ESLint configuration
│       └── tsconfig/            # TypeScript configuration
├── .changeset/          # Changeset configuration for versioning
├── apps/               # Optional (currently empty)
└── tools/              # Build and development tools
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

### @pelatform/mcp.toolkits

- **Purpose**: MCP server for documentation and code assistance
- **Private Package**: Not published to npm
- **Used for**: Internal documentation lookup and code helper functions

### Config Packages

All config packages follow the same pattern:

- **Purpose**: Shared configuration for consistent tooling across projects
- **Usage**: Extended via `extends` in consumer config files
- **Biome**: Opinionated linting and formatting rules (JSONC format, extends via `@pelatform/biome-config/base`)
- **ESLint**: Base, React, and Vite-specific configurations (built with TypeScript compiler, not tsup)
- **TypeScript**: Extendable presets for different environments

### @pelatform/tsconfig

- **Purpose**: Extendable TypeScript configurations
- **Notes**: Consumers override `rootDir`, `outDir`, and `include` to match their structure
- **Available Presets**:
  - `tsconfig.base.json` - Base configuration (ES2022, strict mode)
  - `tsconfig.react.json` - React projects (extends base, adds JSX support)
  - `tsconfig.next.json` - Next.js projects
  - `tsconfig.node.json` - Node.js projects
  - `tsconfig.bun.json` - Bun projects
  - `tsconfig.dom.json` - DOM/browser projects
  - `tsconfig.cf.json` - Cloudflare Workers projects

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
- **Quotes**: Double quotes for JS/TS, double quotes for CSS
- **Semicolons**: Always
- **Trailing Commas**: All
- **Import Sorting**: Enabled with custom groups (React/Next first, then external packages, then @pelatform/\*, then repo packages, then relative imports)

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

## Critical Implementation Details

### Monorepo Workspace Protocol

- Internal dependencies use Bun workspace protocol: `workspace:*` for exact matching, `workspace:^` for version ranges
- Example: `@pelatform/eslint-config` depends on `@pelatform/tsconfig` via `workspace:^`
- Workspace references are resolved during installation and publish

### Package Dependencies

- All packages are ESM-only (no CommonJS support)
- Storage package has optional peer dependencies — consumers only install what they need
- Email package requires React as a peer dependency
- Utils package has both client and server exports (`/server` for Node.js-only utilities)
- MCP package (`@pelatform/mcp.toolkits`) is private and not published to npm

### Build System

- **Standard packages** (email, storage, utils): Use `tsup` with TypeScript for bundling
- **ESLint config packages**: Use TypeScript compiler (`tsc -b`) instead of tsup
- Multiple entry points per package for tree-shaking (e.g., `email` exports `/`, `/components`, `/helpers`)
- Outputs only `dist/` directory for publishing
- Turborepo handles dependency-aware builds (see turbo.json)

### Testing Strategy

- Test commands use root `vitest.config.ts` with project-based configuration
- Each package has separate test project with dedicated setup file in `packages/*/test/setup.ts`
- Coverage reports generated via `test:coverage` using @vitest/coverage-v8
- Tests run after successful builds (`dependsOn: ["^build"]` in turbo.json)

### Code Quality

- Biome extends `@pelatform/biome-config/base` for consistency
- Import sorting with custom groups: React/Next → external packages → @pelatform/\* → relative
- Conventional commits enforced via commitlint (required for changesets)
- Type safety enforced with strict TypeScript configuration
- Husky + lint-staged configured for pre-commit hooks (runs biome check, prettier for MD/YAML)
- Root `lint-staged` config applies to all packages automatically
