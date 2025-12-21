# @pelatform/eslint-config-react

[![Version](https://img.shields.io/npm/v/@pelatform/eslint-config-react.svg)](https://www.npmjs.com/package/@pelatform/eslint-config-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ESLint configuration to use for React projects using Tanstack Query and Router.

This package is only available via ES Modules and requires ESLint 9 or greater, since it uses flat configs.

## Installation

```bash
bun add -D @pelatform/eslint-config-react eslint typescript
```

## Configurations

This package provides two configurations:

- **reactFull** - Full configuration extending `@pelatform/eslint-config` base with React rules
- **reactFast** - Performance-optimized configuration extending `@pelatform/eslint-config` fast with React rules

### Recommended Starter Configuration

For most React projects, use the fast configuration with TypeScript project settings:

```js
// eslint.config.js
import { configs } from "@pelatform/eslint-config-react";

export default [
  // For full configuration with Prettier and all plugins
  // ...configs.reactFull,
  // For fast configuration optimized for Biome (recommended)
  ...configs.reactFast,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

## Biome Integration

When using `reactFast`, you get the same React-specific rules but with the performance benefits from the base fast configuration. **For optimal performance, use [`@pelatform/biome-config`](https://www.npmjs.com/package/@pelatform/biome-config)** alongside the fast configuration:

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

### React-Specific Rules (Same in Both Configs)

All React-specific rules remain the same since Biome doesn't have React equivalents:

- React recommended rules
- React Hooks rules
- JSX accessibility (strict mode)
- TanStack Query linting
- React import validation

See [@pelatform/eslint-config README](https://github.com/pelatformlabs/toolkits/tree/main/packages/config/eslint-config#biome-integration) for the full list of rules handled by Biome.

## Links

- [npm Package](https://www.npmjs.com/package/@pelatform/eslint-config-react)
- [Contributing Guide](../../../CONTRIBUTING.md)
- [Code of Conduct](../../../CODE_OF_CONDUCT.md)
- [License](../../../LICENSE)

## License

MIT © [Pelatform Inc.](../../../LICENSE)
