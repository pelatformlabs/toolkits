# Pelatform Toolkits

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/bun-1.3.3-black)](https://bun.sh)

A collection of ready-to-use packages for modern application development. This monorepo includes reusable packages for email, storage, common utilities, and shared linting/TypeScript configurations.

## Packages

| Package                                                                 | Version                                                                                                                                 | Description                                                 |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [@pelatform/email](./packages/email)                                    | [![npm](https://img.shields.io/npm/v/@pelatform/email.svg)](https://www.npmjs.com/package/@pelatform/email)                             | Email templates and sending utilities (Resend, Nodemailer)  |
| [@pelatform/storage](./packages/storage)                                | [![npm](https://img.shields.io/npm/v/@pelatform/storage.svg)](https://www.npmjs.com/package/@pelatform/storage)                         | Unified storage interface (S3, Cloudinary, R2, MinIO, etc.) |
| [@pelatform/utils](./packages/utils)                                    | [![npm](https://img.shields.io/npm/v/@pelatform/utils.svg)](https://www.npmjs.com/package/@pelatform/utils)                             | Common utility functions for SaaS applications              |
| [@pelatform/biome-config](./packages/config/biome)                      | [![npm](https://img.shields.io/npm/v/@pelatform/biome-config.svg)](https://www.npmjs.com/package/@pelatform/biome-config)               | Opinionated Biome config for lint/format                    |
| [@pelatform/eslint-config](./packages/config/eslint-config)             | [![npm](https://img.shields.io/npm/v/@pelatform/eslint-config.svg)](https://www.npmjs.com/package/@pelatform/eslint-config)             | Shared ESLint configuration                                 |
| [@pelatform/eslint-config-react](./packages/config/eslint-config-react) | [![npm](https://img.shields.io/npm/v/@pelatform/eslint-config-react.svg)](https://www.npmjs.com/package/@pelatform/eslint-config-react) | ESLint configuration for React                              |
| [@pelatform/eslint-config-vite](./packages/config/eslint-config-vite)   | [![npm](https://img.shields.io/npm/v/@pelatform/eslint-config-vite.svg)](https://www.npmjs.com/package/@pelatform/eslint-config-vite)   | ESLint configuration for Vite                               |
| [@pelatform/tsconfig](./packages/config/tsconfig)                       | [![npm](https://img.shields.io/npm/v/@pelatform/tsconfig.svg)](https://www.npmjs.com/package/@pelatform/tsconfig)                       | Extendable TypeScript configuration presets                 |

## Tech Stack

- **Package Manager**: Bun
- **Monorepo Tool**: Turborepo
- **Build Tool**: tsup
- **Linting/Formatting**: Biome
- **Language**: TypeScript

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.3.3 or higher
- Node.js 22 or higher

### Installation

```bash
# Clone repository
git clone https://github.com/pelatformlabs/toolkits.git
cd toolkits

# Install dependencies (Bun)
bun install
```

### Common Commands

```bash
# Development
bun run dev                # Run all packages (watch mode)
bun run build              # Build all packages
bun run types:check        # Type-check all packages

# Linting & Formatting (Biome)
bun run lint               # Lint with safe fixes
bun run lint:fix           # Lint with comprehensive fixes
bun run format             # Format code
bun run format:check       # Check format and fix when needed

# Maintenance
bun run clean              # Clean build outputs
bun run clean:all          # Deep clean (.turbo, bun.lock, node_modules)
```

### Working on Individual Packages

```bash
# Navigate to a specific package
cd packages/email          # or packages/storage, packages/utils

# Package commands
bun run dev                # Development mode (watch)
bun run build              # Build the package
bun run types:check        # Type-check the package
```

## Development Workflow

1. **Create a branch** for your changes
2. **Make your changes** in the appropriate package(s)
3. **Run tests** and type-check: `bun types:check`
4. **Format your code**: `bun lint:format`
5. **Commit your changes** following conventional commits
6. **Submit a pull request**

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

We welcome contributions! This project is community-driven and your help makes it better.

**Getting Started:**

- Read the [Contributing Guide](./CONTRIBUTING.md) for development setup and guidelines
- Check the [Code of Conduct](./CODE_OF_CONDUCT.md)
- Browse [open issues](https://github.com/pelatformlabs/toolkits/issues) or start a [discussion](https://github.com/pelatformlabs/toolkits/discussions)

## Security

If you discover a security vulnerability, please email **pelatformdev@gmail.com**. All vulnerabilities will be addressed promptly.

Do not report security issues through public GitHub issues.

## License

MIT License — see [LICENSE](./LICENSE) for details.

By contributing to Pelatform Toolkits, you agree that your contributions will be licensed under the MIT License.
