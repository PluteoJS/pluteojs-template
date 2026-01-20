# @pluteojs/better-auth

Centralized authentication package for the PluteoJS monorepo, built on [Better Auth](https://www.better-auth.com/).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Email Handlers Setup](#email-handlers-setup)
- [Usage](#usage)
  - [In Express Routes](#in-express-routes)
  - [Authentication Middleware](#authentication-middleware)
  - [Endpoint Security](#endpoint-security)
- [Plugins](#plugins)
- [Access Control](#access-control)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Overview

This package provides a pre-configured Better Auth instance with:

- Email/password authentication
- Email verification
- Password reset
- JWT tokens
- Organization multi-tenancy
- Team management
- Role-based access control (RBAC)
- Configurable email handlers
- Endpoint allowlisting for security

## Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Token-based authentication with configurable signing |
| **Bearer Tokens** | API authentication with signature verification |
| **Organizations** | Multi-tenant support with up to 5 orgs per user |
| **Teams** | Team management within organizations (up to 10 teams) |
| **Invitations** | Email-based organization invitations |
| **RBAC** | Owner, Admin, and Member roles with customizable permissions |
| **Email Verification** | Configurable email verification on signup |
| **Password Reset** | Secure password reset flow |
| **OpenAPI** | API documentation in development mode |

## Installation

This package is part of the monorepo and is already configured. To use it in an app:

```typescript
import { auth, config } from "@pluteojs/better-auth";
```

## Configuration

### Environment Variables

Create a `.env.development.local` file in your app with these required variables:

```bash
# Required
BETTER_AUTH_SECRET=your-secret-key-minimum-64-characters-for-security-purposes
BETTER_AUTH_BASE_URL=http://localhost:3000

# Optional (with defaults)
BETTER_AUTH_BASE_PATH=/api/auth          # Auth routes base path
BETTER_AUTH_COOKIE_SECURE=false          # Set to true in production
BETTER_AUTH_COOKIE_SAME_SITE=lax         # lax, strict, or none
BETTER_AUTH_ENABLE_RESPONSE_ENVELOPE=true # Wrap responses in envelope
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BETTER_AUTH_SECRET` | Yes | - | Min 64 chars. Used for signing tokens and cookies |
| `BETTER_AUTH_BASE_URL` | Yes | - | Full URL where auth endpoints are accessible |
| `BETTER_AUTH_BASE_PATH` | No | `/api/auth` | Base path for auth routes |
| `BETTER_AUTH_COOKIE_SECURE` | No | `false` | Use secure cookies (HTTPS only) |
| `BETTER_AUTH_COOKIE_SAME_SITE` | No | `lax` | Cookie SameSite attribute |
| `BETTER_AUTH_ENABLE_RESPONSE_ENVELOPE` | No | `true` | Wrap responses in standard envelope |

### Email Handlers Setup

Email handlers must be configured before using authentication features that send emails (signup verification, password reset, org invitations).

**In your app's loader/initialization file:**

```typescript
// apps/express-api-server/src/loaders/betterAuthLoader.ts
import { configureEmailHandlers, type iEmailSendOptions } from "@pluteojs/better-auth";
import config from "@config";
import logger from "@loaders/logger";
import emailServiceUtil from "@util/emailServiceUtil";

async function sendEmail(options: iEmailSendOptions): Promise<void> {
  await emailServiceUtil.sendTransactionHtmlEmail(
    options.from,
    options.to,
    null, // cc
    null, // bcc
    options.subject,
    options.text || "",
    options.html
  );
}

export default function loadBetterAuth(): void {
  configureEmailHandlers({
    sender: sendEmail,
    logger: {
      info: (requestId, message, data) => logger.info(requestId, message, null, data),
      error: (requestId, message, error) => logger.error(requestId, message, error),
    },
    fromAddress: config.emailService.transactionalEmail.smtpFromAddress,
    appName: config.serviceInfo.name || "PluteoJS",
  });

  logger.info(null, "Better Auth email handlers configured");
}
```

**Call this before loading routes:**

```typescript
// apps/express-api-server/src/loaders/index.ts
import loadBetterAuth from "@loaders/betterAuthLoader";
import loadExpress from "@loaders/expressLoader";

const loader = async ({ expressApp }) => {
  // Configure better-auth email handlers FIRST
  loadBetterAuth();

  // Then load express routes
  await loadExpress({ app: expressApp });
};
```

## Usage

### In Express Routes

```typescript
// apps/express-api-server/src/api/routes/betterAuthRoute.ts
import type { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth, isEndpointAllowed } from "@pluteojs/better-auth";

export default (route: Router): void => {
  route.all(/^\/auth\/.*/, async (req, res) => {
    // Check endpoint allowlist
    if (!isEndpointAllowed(req.path, req.method)) {
      return res.status(404).json({ error: "Not found" });
    }

    // Create Web Request
    const url = new URL(req.originalUrl, `${req.protocol}://${req.get("host")}`);
    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers: fromNodeHeaders(req.headers),
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    // Handle with better-auth
    const response = await auth.handler(webRequest);

    // Return response (preserving cookies)
    response.headers.forEach((value, key) => res.setHeader(key, value));
    const body = await response.json();
    res.status(response.status).json(body);
  });
};
```

### Authentication Middleware

```typescript
// apps/express-api-server/src/api/middlewares/authorizationMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@pluteojs/better-auth";

export async function isAuthorized(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Attach to request for downstream use
  req.session = session.session;
  req.user = session.user;

  next();
}
```

### Endpoint Security

The package includes a security allowlist to prevent exposing unintended Better Auth endpoints:

```typescript
import { isEndpointAllowed, defaultAllowedEndpoints } from "@pluteojs/better-auth";

// Check if endpoint is allowed
if (!isEndpointAllowed("/auth/sign-in/email", "POST")) {
  // Block request
}

// Use custom allowlist
const customAllowlist = {
  "/auth/sign-in/email": ["POST"],
  "/auth/sign-out": ["POST"],
};

if (!isEndpointAllowed("/auth/sign-in/email", "POST", customAllowlist)) {
  // Block request
}
```

**Available Endpoints:**

| Category | Endpoints |
|----------|-----------|
| **Auth Core** | `sign-up/email`, `sign-in/email`, `sign-out`, `get-session` |
| **Email** | `verify-email`, `send-verification-email` |
| **Password** | `forget-password`, `reset-password` |
| **JWT** | `token`, `jwks` |
| **Organization** | `create`, `list`, `get-full-organization`, `set-active`, `update`, `delete` |
| **Invitations** | `invite-member`, `accept-invitation`, `reject-invitation`, `cancel-invitation`, `get-invitation` |
| **Members** | `remove-member`, `update-member-role` |
| **Teams** | `create-team`, `list-teams`, `update-team`, `remove-team`, `add-team-member`, `remove-team-member`, `add-team-members` |

## Plugins

### Core Plugins (Always Enabled)

| Plugin | Configuration |
|--------|---------------|
| **JWT** | Default settings |
| **Bearer** | `requireSignature: true` |
| **Organization** | See below |

**Organization Plugin Settings:**

```typescript
{
  allowUserToCreateOrganization: true,
  organizationLimit: 5,
  creatorRole: "owner",
  membershipLimit: 50,
  teams: {
    enabled: true,
    maximumTeams: 10,
    maximumMembersPerTeam: 50,
  },
  invitationLimit: 50,
  cancelPendingInvitationsOnReInvite: true,
  requireEmailVerificationOnInvitation: false,
}
```

### Development Plugins

| Plugin | Description |
|--------|-------------|
| **OpenAPI** | API documentation at `/auth/reference` (dev only) |

## Access Control

### Roles

| Role | Description | Default Permissions |
|------|-------------|---------------------|
| **owner** | Full access to everything | All CRUD on projects, resources |
| **admin** | Can manage most resources | Create, read, update projects; read resources |
| **member** | Basic read access | Read-only on projects and resources |

### Permission Statements

```typescript
{
  ...defaultStatements,  // organization, member, invitation
  project: ["create", "read", "update", "delete"],
  resource: ["create", "read", "update", "delete"],
}
```

### Extending Permissions

To add custom permissions, edit `src/permissions/accessControl.ts`:

```typescript
const permissionStatements = {
  ...defaultStatements,
  project: ["create", "read", "update", "delete"],
  resource: ["create", "read", "update", "delete"],
  // Add your custom permissions
  document: ["create", "read", "update", "delete", "share"],
  report: ["create", "read", "export"],
} as const;

// Update roles accordingly
const admin = accessControl.newRole({
  ...defaultAdminAc.statements,
  project: ["create", "read", "update"],
  document: ["create", "read", "update"],  // Add to admin
});
```

### Using Access Control

```typescript
import { accessControl, roles } from "@pluteojs/better-auth";

// Check if role has permission
const canCreate = roles.admin.authorize({
  project: ["create"],
});
```

## Database Schema

### Schema Generation

When you modify plugins or need to update the schema:

```bash
# From packages/better-auth
pnpm better-auth:generate
```

This generates the schema to `packages/database/src/schema/betterAuth/betterAuth.schema.ts`.

**Important:** After generation, manually change `id` and `userId` fields from `text` to `uuid` if needed.

### Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts |
| `sessions` | Active sessions with `activeOrganizationId`, `activeTeamId` |
| `accounts` | OAuth/linked accounts, password hashes |
| `verifications` | Email verification and password reset tokens |
| `jwkss` | JWT signing keys |
| `organizations` | Organization entities |
| `members` | Organization memberships with roles |
| `teams` | Teams within organizations |
| `teamMembers` | Team memberships |
| `invitations` | Pending organization invitations |

### Migration Process

**Never use `npx better-auth migrate` directly.** Follow this process:

1. Generate schema:
   ```bash
   pnpm --filter @pluteojs/better-auth better-auth:generate
   ```

2. Manually update the generated schema (if needed):
   - Change `id` fields from `text` to `uuid`
   - Change `userId` fields from `text` to `uuid`

3. Generate migration with Drizzle:
   ```bash
   pnpm --filter @pluteojs/database db:generate
   ```

4. Apply migration:
   ```bash
   pnpm --filter @pluteojs/database db:migrate
   ```

## Architecture

```
packages/better-auth/
├── src/
│   ├── index.ts                    # Main exports
│   ├── auth.ts                     # Runtime auth instance
│   ├── auth.shared.ts              # Shared config (plugins, settings)
│   ├── auth.cli.ts                 # CLI config for schema generation
│   ├── config/
│   │   ├── index.ts                # Config loader & validation
│   │   ├── envSchema.ts            # Zod schema for env vars
│   │   └── allowedEndpoints.ts     # Endpoint allowlist
│   ├── email/
│   │   └── handlers.ts             # Email handler implementations
│   ├── permissions/
│   │   └── accessControl.ts        # RBAC definitions
│   ├── types/
│   │   └── index.ts                # Type definitions
│   └── util/
│       └── index.ts                # Utility exports
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### Three-File Configuration Pattern

This package uses a three-file pattern to solve CLI path alias resolution issues:

| File | Purpose | Path Aliases |
|------|---------|--------------|
| `auth.shared.ts` | Common settings shared by runtime and CLI | No (relative only) |
| `auth.ts` | Runtime configuration with database | Yes |
| `auth.cli.ts` | CLI configuration for schema generation | No (relative only) |

**Why?** The Better Auth CLI uses `jiti` which doesn't resolve TypeScript path aliases. By keeping shared configuration in a file with relative imports, both runtime and CLI can use the same settings.

## API Reference

### Exports

```typescript
// Main auth instance
export { auth } from "./auth.js";
export type { Auth } from "./auth.js";

// Configuration
export { config } from "./config/index.js";
export type { EnvConfig } from "./config/index.js";

// Endpoint security
export { isEndpointAllowed, defaultAllowedEndpoints } from "./config/allowedEndpoints.js";

// Access control
export { accessControl, roles } from "./permissions/accessControl.js";

// Email configuration
export { configureEmailHandlers } from "./email/handlers.js";
export type { iEmailSendOptions, EmailSenderFn, iEmailLogger } from "./email/handlers.js";

// Types
export type {
  AuthSession,
  ExtendedUser,
  ExtendedSession,
  OrganizationInviteEmailData,
  EmailVerificationData,
  PasswordResetEmailData,
} from "./types/index.js";

// Re-exports from better-auth
export type { Session, User } from "better-auth";
```

### `configureEmailHandlers(config)`

Configures the email sending functionality for Better Auth.

```typescript
interface iEmailHandlerConfig {
  sender: EmailSenderFn;      // Required: function to send emails
  logger?: iEmailLogger;      // Optional: custom logger
  fromAddress: string;        // Required: sender email address
  appName?: string;           // Optional: app name for email templates
}

interface iEmailSendOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

type EmailSenderFn = (options: iEmailSendOptions) => Promise<void>;
```

### `isEndpointAllowed(path, method, allowlist?)`

Checks if an endpoint is in the security allowlist.

```typescript
function isEndpointAllowed(
  path: string,           // e.g., "/auth/sign-in/email"
  method: string,         // e.g., "POST"
  allowlist?: Record<string, string[]>  // Optional custom allowlist
): boolean;
```

## Troubleshooting

### "Secret must be at least 64 characters"

Generate a secure secret:

```bash
openssl rand -base64 64
```

### Schema generation fails

Ensure you're using relative imports in `auth.cli.ts` and `auth.shared.ts`. The CLI doesn't resolve TypeScript path aliases.

### Cookies not being set

1. Check `BETTER_AUTH_COOKIE_SECURE` - set to `false` for local HTTP development
2. Ensure `BETTER_AUTH_COOKIE_SAME_SITE` is appropriate for your setup
3. Verify the response headers are being copied to the client

### Email handlers not working

1. Ensure `configureEmailHandlers()` is called before routes are loaded
2. Check that your email sender function is correctly implemented
3. Verify the logger is capturing errors

### Type errors with plugins

If you get type errors after modifying plugins:

1. Regenerate the schema: `pnpm better-auth:generate`
2. Rebuild the package: `pnpm --filter @pluteojs/better-auth build`
3. Restart your TypeScript server

### Organization context not available

Ensure the session has an active organization:

```typescript
const session = await auth.api.getSession({ headers });

if (!session?.session.activeOrganizationId) {
  // User needs to select/create an organization
}
```

## Related Documentation

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [@pluteojs/database](../database/README.md)
- [@pluteojs/email-templates](../email-templates/README.md)
