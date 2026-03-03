# @pelatform/tsconfig

[![Version](https://img.shields.io/npm/v/@pelatform/tsconfig.svg)](https://www.npmjs.com/package/@pelatform/tsconfig)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Common TypeScript configuration for modern projects.

## Installation

```bash
npm install @pelatform/tsconfig
# or
bun add @pelatform/tsconfig
```

## Usage

Create a `tsconfig.json` in your project root and extend one of the presets:

```json
{
  "extends": "@pelatform/tsconfig/base",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

## Available Presets

### `@pelatform/tsconfig/base`

Base configuration for general TypeScript projects.

**Features:**

- Target: ES2022
- Module: ESNext
- Strict mode enabled
- Module resolution: bundler
- Allows synthetic default imports
- Resolve JSON modules
- No ESM emit

**Use case:** General TypeScript libraries and projects

```json
{
  "extends": "@pelatform/tsconfig/base"
}
```

### `@pelatform/tsconfig/react`

Configuration for React projects (supports both React 18+ and 19+).

**Features:**

- Extends `base`
- JSX: react-jsx (automatic JSX runtime)
- DOM types enabled

**Use case:** React applications and libraries

```json
{
  "extends": "@pelatform/tsconfig/react"
}
```

### `@pelatform/tsconfig/next`

Configuration for Next.js projects.

**Features:**

- Extends `react`
- Next.js-specific optimizations
- Plugin support for Next.js

**Use case:** Next.js applications

```json
{
  "extends": "@pelatform/tsconfig/next"
}
```

### `@pelatform/tsconfig/node`

Configuration for Node.js libraries and applications.

**Features:**

- Extends `base`
- Node.js types enabled
- Module resolution: node16

**Use case:** Node.js packages, CLI tools, server-side code

```json
{
  "extends": "@pelatform/tsconfig/node"
}
```

### `@pelatform/tsconfig/bun`

Configuration for Bun projects.

**Features:**

- Extends `base`
- Bun types enabled
- Optimized for Bun runtime

**Use case:** Bun applications and libraries

```json
{
  "extends": "@pelatform/tsconfig/bun"
}
```

### `@pelatform/tsconfig/dom`

Configuration for browser/DOM projects.

**Features:**

- Extends `base`
- DOM types enabled
- Browser APIs available

**Use case:** Browser-based applications, vanilla JS projects

```json
{
  "extends": "@pelatform/tsconfig/dom"
}
```

### `@pelatform/tsconfig/cf`

Configuration for Cloudflare Workers projects.

**Features:**

- Extends `base`
- Cloudflare Workers types
- Edge runtime optimized

**Use case:** Cloudflare Workers, Pages Functions

```json
{
  "extends": "@pelatform/tsconfig/cf"
}
```

## Override Options

When extending any preset, you should override these options to match your project:

```json
{
  "extends": "@pelatform/tsconfig/base",
  "compilerOptions": {
    "rootDir": "./src", // Your source directory
    "outDir": "./dist" // Your build output
  },
  "include": [
    "src/**/*" // Files to include
  ],
  "exclude": ["node_modules", "dist"]
}
```

## Links

- [npm Package](https://www.npmjs.com/package/@pelatform/tsconfig)
- [Contributing Guide](../../../CONTRIBUTING.md)
- [Code of Conduct](../../../CODE_OF_CONDUCT.md)
- [License](../../../LICENSE)

## License

MIT © [Pelatform Inc.](../../../LICENSE)
