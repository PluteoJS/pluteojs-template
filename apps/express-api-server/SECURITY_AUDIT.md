# Security Audit Report

**Date:** 2026-01-22
**Audited By:** Claude Code
**Scope:** Express API Server (`apps/express-api-server`) and Packages (`packages/*`)

---

## Summary

| Severity | Issues |
|----------|--------|
| Critical | #1, #2, #3 |
| High | #4, #5, #6 |
| Medium | #7, #8, #9 |
| Low | #10, #11 |

---

## Issue #1: No Rate Limiting

**Severity:** Critical
**Status:** [ ] Not Fixed

**Location:**
- `apps/express-api-server/src/loaders/expressLoader.ts`

**Description:**
No rate limiting middleware is implemented anywhere in the application. All endpoints are vulnerable to abuse.

**Vulnerable Endpoints:**
- `/api/v1/verification/request-email-verification` - Can be abused to flood emails
- `/api/auth/*` - Vulnerable to brute-force credential attacks
- All other endpoints - DoS vulnerability

**Impact:**
- Brute-force attacks on authentication
- OTP/email flooding attacks
- Resource exhaustion (DoS)
- Increased infrastructure costs from abuse

**Recommendation:**
Install and configure `express-rate-limit`:

```bash
pnpm add express-rate-limit
```

Suggested configuration:
- General API: 100 requests per 15 minutes per IP
- Auth endpoints: 5-10 requests per 15 minutes per IP
- Email verification: 3 requests per hour per email

**References:**
- https://www.npmjs.com/package/express-rate-limit
- OWASP API Security Top 10 - API4:2023 Unrestricted Resource Consumption

---

## Issue #2: CORS Allows All Origins

**Severity:** Critical
**Status:** [ ] Not Fixed

**Location:**
- `apps/express-api-server/src/loaders/expressLoader.ts:211`

**Current Code:**
```typescript
app.use(cors());
```

**Description:**
CORS is configured without any restrictions, allowing any website to make requests to the API. This is dangerous for APIs that use cookies or session-based authentication.

**Impact:**
- Cross-site request forgery potential
- Data exfiltration from authenticated sessions
- Malicious sites can interact with authenticated user sessions

**Recommendation:**
Configure CORS with explicit allowed origins:

```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

**References:**
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- OWASP - CORS Misconfiguration

---

## Issue #3: OTP Logged in Plain Text

**Severity:** Critical
**Status:** [ ] Not Fixed

**Location:**
- `apps/express-api-server/src/services/VerificationService.ts:44`

**Current Code:**
```typescript
logger.silly("Generated OTP: %s", otp);
```

**Description:**
The email verification OTP is logged in plain text. Log files could be accessed by developers, operations staff, or attackers who gain log access.

**Impact:**
- OTPs can be extracted from logs to bypass email verification
- Compliance violations (logging sensitive authentication data)
- Insider threat risk

**Recommendation:**
Remove OTP logging entirely or log only metadata:

```typescript
logger.silly("OTP generated for email verification", { email: maskedEmail });
```

**References:**
- OWASP - Logging Sensitive Information

---

## Issue #4: No CSRF Protection

**Severity:** High
**Status:** [ ] Not Fixed

**Location:**
- `apps/express-api-server/src/loaders/expressLoader.ts`

**Description:**
No CSRF (Cross-Site Request Forgery) protection middleware is implemented. While `sameSite: lax` cookies provide some protection, explicit CSRF tokens are recommended for state-changing operations.

**Impact:**
- Attackers can trick authenticated users into performing unwanted actions
- Account modifications, data changes without user consent

**Recommendation:**
For session-based auth with cookies, implement CSRF protection:

Option A: Use `csrf-csrf` package for double-submit cookie pattern
Option B: Rely on `SameSite=Strict` cookies (more restrictive)
Option C: Implement custom CSRF token validation

Note: If using only Bearer token authentication (no cookies), CSRF is less of a concern. Clarify the auth strategy being used.

**References:**
- https://owasp.org/www-community/attacks/csrf
- https://www.npmjs.com/package/csrf-csrf

---

## Issue #5: Weak Password Schema Validation

**Severity:** High
**Status:** [ ] Not Fixed

**Location:**
- `packages/api-types/src/common.ts:17`

**Current Code:**
```typescript
export const passwordSchema = z.string().min(1, "Password is required");
```

**Description:**
The password schema only requires 1 character minimum, while better-auth is configured with `minPasswordLength: 8`. This inconsistency could allow weak passwords through direct API calls or confuse developers.

**Impact:**
- Inconsistent validation between API types and auth library
- Potential for weak passwords if schema is used elsewhere
- Developer confusion

**Recommendation:**
Update the schema to match better-auth configuration:

```typescript
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");
```

**References:**
- NIST Digital Identity Guidelines (SP 800-63B)

---

## Issue #6: Trust Proxy Enabled Unconditionally

**Severity:** High
**Status:** [ ] Not Fixed

**Location:**
- `apps/express-api-server/src/loaders/expressLoader.ts:205`

**Current Code:**
```typescript
app.enable("trust proxy");
```

**Description:**
`trust proxy` is enabled in all environments without configuration. This tells Express to trust `X-Forwarded-*` headers, which can be spoofed if the server is not behind a trusted proxy.

**Impact:**
- IP address spoofing via `X-Forwarded-For` header
- Rate limiting bypass (if based on IP)
- Incorrect logging of client IPs
- Security controls bypass

**Recommendation:**
Configure based on deployment environment:

```typescript
// Only trust proxy in production behind load balancer
if (process.env.NODE_ENV === 'production') {
  // Trust first proxy (adjust based on your infrastructure)
  app.set('trust proxy', 1);
} else {
  app.set('trust proxy', false);
}
```

**References:**
- https://expressjs.com/en/guide/behind-proxies.html
- Express.js Security Best Practices

---

## Issue #7: Cookie Secure Flag Defaults to False

**Severity:** Medium
**Status:** [ ] Not Fixed

**Location:**
- `packages/better-auth/src/config/envSchema.ts:14-17`

**Current Code:**
```typescript
BETTER_AUTH_COOKIE_SECURE: z
  .enum(["true", "false"])
  .default("false")
  .transform((val) => val === "true"),
```

**Description:**
The secure flag for authentication cookies defaults to `false`. If not explicitly set in production, session cookies will be transmitted over HTTP, making them vulnerable to interception.

**Impact:**
- Session hijacking via network sniffing
- Man-in-the-middle attacks
- Cookie theft on insecure networks

**Recommendation:**
Change default to `true` or derive from environment:

```typescript
BETTER_AUTH_COOKIE_SECURE: z
  .enum(["true", "false"])
  .default(process.env.NODE_ENV === "production" ? "true" : "false")
  .transform((val) => val === "true"),
```

Or require explicit configuration without a default in production.

**References:**
- OWASP - Secure Cookie Attribute

---

## Issue #8: OpenAPI Endpoint Allows unsafe-inline Scripts

**Severity:** Medium
**Status:** [ ] Not Fixed

**Location:**
- `apps/express-api-server/src/api/routes/v1/authRoute.ts:145-148`

**Current Code:**
```typescript
res.setHeader(
  "Content-Security-Policy",
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; ..."
);
```

**Description:**
The Content Security Policy for the OpenAPI reference endpoint allows `'unsafe-inline'` scripts, which weakens XSS protection on that page.

**Impact:**
- Potential XSS vulnerabilities on the API documentation page
- Reduced effectiveness of CSP

**Recommendation:**
If possible, use nonces or hashes instead of `'unsafe-inline'`. If the Scalar library requires inline scripts, consider:
1. Serving OpenAPI docs from a separate subdomain
2. Restricting access to development environments only
3. Using strict-dynamic with nonces if Scalar supports it

**References:**
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- Content Security Policy Level 3

---

## Issue #9: Dev Plugins Exposed in Non-Production Environments

**Severity:** Medium
**Status:** [ ] Not Fixed

**Location:**
- `packages/better-auth/src/auth.ts:21-26`

**Current Code:**
```typescript
const getPlugins = () => {
  if (process.env.NODE_ENV === "production") {
    return [...corePlugins];
  }
  return [...corePlugins, ...devPlugins];
};
```

**Description:**
The OpenAPI plugin (in devPlugins) is enabled in all non-production environments, including staging. This exposes API documentation that could help attackers understand the API structure.

**Impact:**
- API structure exposed in staging environments
- Potential information disclosure

**Recommendation:**
Restrict dev plugins to local development only:

```typescript
const getPlugins = () => {
  const isDevelopment = process.env.NODE_ENV === 'development' ||
                        process.env.NODE_ENV === 'development_local';
  if (isDevelopment) {
    return [...corePlugins, ...devPlugins];
  }
  return [...corePlugins];
};
```

**References:**
- OWASP - Information Disclosure

---

## Issue #10: No Request Body Size Limit

**Severity:** Low
**Status:** [ ] Not Fixed

**Location:**
- `apps/express-api-server/src/loaders/expressLoader.ts:220`

**Current Code:**
```typescript
app.use(express.json());
```

**Description:**
No explicit body size limit is set for JSON parsing. The default is 100kb, but explicitly setting a limit is a best practice.

**Impact:**
- Potential for large payload attacks
- Memory exhaustion with very large requests

**Recommendation:**
Set explicit body size limits:

```typescript
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

**References:**
- Express.js Security Best Practices

---

## Issue #11: Consider Additional Helmet Configuration

**Severity:** Low
**Status:** [ ] Not Fixed

**Location:**
- `apps/express-api-server/src/loaders/expressLoader.ts:208`

**Current Code:**
```typescript
app.use(helmet());
```

**Description:**
Helmet is used with default configuration. Consider adding additional security headers for enhanced protection.

**Recommendation:**
Configure Helmet with stricter policies:

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

**References:**
- https://helmetjs.github.io/

---

## Positive Security Findings

The following security practices are already well-implemented:

1. **Helmet.js** - Security headers are enabled
2. **Zod Validation** - Input validation is implemented for request bodies
3. **Drizzle ORM** - Parameterized queries prevent SQL injection
4. **argon2** - Secure password hashing algorithm available
5. **better-auth** - Handles session management with httpOnly cookies
6. **crypto.randomUUID()** - Secure UUID generation
7. **64-char secret requirement** - Strong secret enforcement for auth
8. **Error handling** - Stack traces not leaked to clients
9. **No eval()** - No dangerous code execution patterns detected
10. **Bearer token signatures** - Required for API authentication

---

## Next Steps

1. Review each issue and discuss implementation approach
2. Fix critical issues first (#1, #2, #3)
3. Address high severity issues (#4, #5, #6)
4. Implement medium and low severity fixes (#7 - #11)
5. Run `pnpm audit` to check for vulnerable dependencies
6. Consider security testing/penetration testing after fixes

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-22 | 1.0 | Initial security audit |
