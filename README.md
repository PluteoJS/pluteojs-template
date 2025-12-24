# PluteoJS

A full-stack TypeScript monorepo template for building scalable applications with Next.js, Express, and shared packages.

Created by [Muhammad Swalah](https://swalahamani.com) at [HeedLabs](https://heedlabs.com).

## What's Inside?

This Turborepo monorepo includes the following apps and packages:

### Apps

| App                            | Description                                                     | Port |
| ------------------------------ | --------------------------------------------------------------- | ---- |
| `@pluteojs/next-web`           | Next.js 16 frontend with React 19, Redux Toolkit, and shadcn/ui | 4000 |
| `@pluteojs/express-api-server` | Express.js REST API server with TypeScript                      | 3000 |

### Packages

| Package                       | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| `@pluteojs/api-types`         | Shared Zod validation schemas and TypeScript types |
| `@pluteojs/database`          | Drizzle ORM setup with PostgreSQL                  |
| `@pluteojs/email-templates`   | React Email templates                              |
| `@pluteojs/eslint-config`     | Shared ESLint configurations                       |
| `@pluteojs/typescript-config` | Shared TypeScript configurations                   |

## Tech Stack

- **Runtime**: Node.js 20+
- **Package Manager**: pnpm
- **Build System**: Turborepo
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, shadcn/ui
- **Backend**: Express.js, Drizzle ORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **State Management**: Redux Toolkit
- **Type Safety**: TypeScript 5.9+

## Getting Started

### Prerequisites

- Node.js 20.9 or higher
- pnpm 9+
- PostgreSQL (for database package)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pluteojs-template

# Install dependencies
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run a specific app
pnpm --filter @pluteojs/next-web dev
pnpm --filter @pluteojs/express-api-server dev
```

### Build

```bash
# Build all apps and packages
pnpm build

# Build a specific app/package
pnpm --filter @pluteojs/next-web build
pnpm --filter @pluteojs/express-api-server build
```

### Code Quality

```bash
# Run linting across all packages
pnpm lint

# Run type checking across all packages
pnpm check-types

# Format code with Prettier
pnpm format
```

## Project Structure

```
pluteojs-template/
├── apps/
│   ├── next-web/              # Next.js frontend application
│   └── express-api-server/    # Express.js API server
├── packages/
│   ├── api-types/             # Shared Zod schemas & types
│   ├── database/              # Drizzle ORM configuration
│   ├── email-templates/       # React Email templates
│   ├── eslint-config/         # Shared ESLint config
│   └── typescript-config/     # Shared TypeScript config
├── tooling/                   # Monorepo utilities
├── turbo.json                 # Turborepo configuration
└── pnpm-workspace.yaml        # pnpm workspace configuration
```

## Key Features

- **Monorepo Architecture**: Organized codebase with shared packages and optimized builds
- **Full-Stack TypeScript**: End-to-end type safety with shared types between frontend and backend
- **Modern Tooling**: Latest versions of Next.js, React, and development tools
- **Code Quality**: Pre-configured ESLint, Prettier, and TypeScript strict mode
- **Database Ready**: Drizzle ORM with PostgreSQL support
- **Email Templates**: React Email for transactional emails

## Useful Commands

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `pnpm dev`         | Start all apps in development mode |
| `pnpm build`       | Build all apps and packages        |
| `pnpm lint`        | Run ESLint across all packages     |
| `pnpm check-types` | Run TypeScript type checking       |
| `pnpm format`      | Format code with Prettier          |
| `pnpm clean`       | Clean build artifacts              |

## Learn More

- [Turborepo Documentation](https://turborepo.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## License

MIT
