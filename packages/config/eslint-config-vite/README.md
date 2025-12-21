# @pelatform/eslint-config-vite

[![Version](https://img.shields.io/npm/v/@pelatform/eslint-config-vite.svg)](https://www.npmjs.com/package/@pelatform/eslint-config-vite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ESLint configuration for Vite projects with React Refresh support.

This package is only available via ES Modules and requires ESLint 9 or greater, since it uses flat configs.

## Installation

```bash
bun add -D @pelatform/eslint-config-vite eslint typescript
```

## Configurations

This package provides two configurations:

- **viteFull** - Full configuration extending `@pelatform/eslint-config-react` reactFull with React Refresh rules
- **viteFast** - Performance-optimized configuration extending `@pelatform/eslint-config-react` reactFast with React Refresh rules

### Recommended Starter Configuration

For most Vite React projects, use the fast configuration with TypeScript project settings:

```js
// eslint.config.js
import { configs } from "@pelatform/eslint-config-vite";

export default [
  // For full configuration with Prettier and all plugins
  // ...configs.viteFull,
  // For fast configuration optimized for Biome (recommended)
  ...configs.viteFast,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

## React Refresh Plugin

This configuration adds the `eslint-plugin-react-refresh` plugin to ensure your React components work properly with Vite's Hot Module Replacement (HMR):

### Key Rules

- **react-refresh/only-export-components** - Warns when files export things other than React components, which can break HMR
  - Configured with `{ allowConstantExport: true }` to allow constant exports alongside components

## Biome Integration

When using `viteFast`, you get the same React and Vite-specific rules but with the performance benefits from the base fast configuration. **For optimal performance, use [`@pelatform/biome-config`](https://www.npmjs.com/package/@pelatform/biome-config)** alongside the fast configuration:

```bash
bun add -D @pelatform/biome-config @biomejs/biome
```

```jsonc
// biome.jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "extends": ["@pelatform/biome-config/base"],
}
```

### What's Different in Fast Mode

The fast configuration inherits optimizations from `@pelatform/eslint-config` fast mode:

- **No Prettier** - Use Biome's formatter instead
- **No simple-import-sort** - Use Biome's `organizeImports` instead
- **No unused-imports plugin** - Use Biome's `noUnusedImports` instead
- **Delegated rules** - Basic linting rules handled by Biome

### Vite & React-Specific Rules (Same in Both Configs)

All Vite and React-specific rules remain the same since Biome doesn't have equivalents:

- React recommended rules
- React Hooks rules
- JSX accessibility (strict mode)
- TanStack Query linting (from React config)
- TanStack Router linting (included in Vite config)
- React import validation
- React Refresh rules for Vite HMR

See [@pelatform/eslint-config README](https://github.com/pelatformlabs/toolkits/tree/main/packages/config/eslint-config#biome-integration) for the full list of rules handled by Biome.

## Links

- [npm Package](https://www.npmjs.com/package/@pelatform/eslint-config-vite)
- [Contributing Guide](../../../CONTRIBUTING.md)
- [Code of Conduct](../../../CODE_OF_CONDUCT.md)
- [License](../../../LICENSE)

## License

MIT © [Pelatform Inc.](../../../LICENSE)
