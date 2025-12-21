# @pelatform/biome-config

[![Version](https://img.shields.io/npm/v/@pelatform/biome-config.svg)](https://www.npmjs.com/package/@pelatform/biome-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Opinionated [Biome](https://biomejs.dev) configuration for modern TypeScript projects.

## Installation

```bash
bun add -D @pelatform/biome-config @biomejs/biome
```

## Usage

Create a `biome.jsonc` file in your project root:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@pelatform/biome-config/base"]
}
```

## Features

### Core

- VCS integration enabled (Git, honors ignore files)
- Includes all files except common build outputs (`dist`, `build`, `.turbo`, `coverage`, `node_modules`, etc.)
- Unknown file kinds are not ignored by default

### Formatting

- Indentation: 2 spaces
- Line endings: LF
- Line width: 100
- Global formatter enabled

### JavaScript/TypeScript Formatting

- Quote style: double
- Arrow parentheses: always
- Bracket same line: false
- Bracket spacing: true
- Quote properties: as needed
- Semicolons: always
- Trailing commas: all

### JSON Formatting

- Indentation: 2 spaces
- Trailing commas: none

### HTML

- HTML formatter enabled
- Experimental full support enabled

### CSS

- Formatter enabled (2-space indent, double quotes)
- Tailwind directives parsing enabled

### Linting

- Linter enabled
- Recommended rules: on
- Accessibility rules largely disabled for pragmatic development
- Correctness:
  - `noUnusedImports`: level info, safe fix
  - `noUnknownTypeSelector`, `useUniqueElementIds`, `noUnusedFunctionParameters`, `useParseIntRadix`, `useHookAtTopLevel`: off
- Style:
  - `useConst`: error
  - `useShorthandAssign`: error
  - `useSingleVarDeclarator`: error
  - `useSelfClosingElements`: level info, safe fix
  - `useTemplate`: level info, safe fix
  - `useComponentExportOnlyModules`: warn (supports React Fast Refresh)
  - `useReactFunctionComponents`: error
- Suspicious:
  - `noExplicitAny`: warn
  - `noDoubleEquals`: warn, safe fix
  - `noArrayIndexKey`, `noUnknownAtRules`, `noDuplicateProperties`: off
- Nursery:
  - `useSortedClasses`: level info, safe fix; recognizes `cn()` utility

### Code Assists (Organize Imports)

- Import organization enabled with natural identifier order
- Grouping strategy:
  - URL, Node, Bun built-ins
  - React, Next
  - Third-party packages (excluding `@pelatform/**`, `pelatformui`, `@repo/**`)
  - `@pelatform/**`, `pelatformui`, `@repo/**`
  - Aliases
  - Relative paths

## Links

- [npm Package](https://www.npmjs.com/package/@pelatform/biome-config)
- [Contributing Guide](../../../CONTRIBUTING.md)
- [Code of Conduct](../../../CODE_OF_CONDUCT.md)
- [License](../../../LICENSE)

## License

MIT © [Pelatform Inc.](../../../LICENSE)
