# Tooling Workspace

This workspace contains DevOps and development tooling packages, separated from application code (`/apps`) and shared libraries (`/packages`).

## Why a Separate Tooling Workspace?

| Workspace   | Purpose              | Examples                            |
| ----------- | -------------------- | ----------------------------------- |
| `/apps`     | Application code     | Express API server, web apps        |
| `/packages` | Shared libraries     | API types, ESLint config, TS config |
| `/tooling`  | DevOps & dev tooling | Release automation, CI helpers, IaC |

**Benefits:**

- **Clear separation** - DevOps tooling doesn't mix with application code
- **Independent dependencies** - Each tooling package can have its own dependencies without polluting app packages
- **Scalable** - Easy to add new tooling packages as needs grow
- **Cacheable** - Turborepo can cache tooling builds independently

## Naming Convention

Tooling packages follow the `<domain>-<specific>` naming pattern:

```
tooling/
├── release-versioning/    # Semantic versioning automation
├── release-changelog/     # (future) Changelog generation
├── monorepo-utils/        # Monorepo management utilities
├── infra-terraform/       # (future) Terraform wrappers
├── ci-github/             # (future) GitHub Actions helpers
```

Package names: `@pluteojs/tooling-<domain>-<specific>`

## Current Packages

### `release-versioning`

Semantic versioning automation for git-flow releases.

**Scripts:**

- `pnpm release:compute-version` - Computes next version based on conventional commits
- `pnpm release:fix-branch` - Renames release branch to match package.json version

**Dependencies:** `conventional-recommended-bump`, `semver`, `simple-git`

### `monorepo-utils`

Monorepo management utilities.

**Scripts:**

- `enforce-pnpm.mjs` - Ensures pnpm is used as package manager (runs on preinstall)
- `sync-pnpm-preinstall.mjs` - Syncs preinstall scripts across all packages

## Adding New Tooling

1. Create a new directory: `tooling/<domain>-<specific>/`
2. Add `package.json` with name `@pluteojs/tooling-<domain>-<specific>`
3. Set `"private": true` (tooling packages are not published)
4. Add scripts to root `package.json` if needed
5. Run `pnpm install` to link the new package

Example structure:

```
tooling/my-new-tool/
├── package.json
├── tsconfig.json (if TypeScript)
└── src/
    └── index.ts
```
