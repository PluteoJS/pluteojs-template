/**
 * Better Auth constants.
 */

/**
 * OpenAPI reference endpoint path suffix.
 *
 * IMPORTANT: This constant is used ONLY for detection/matching purposes to determine
 * when to bypass the response envelope wrapping. It does NOT configure where better-auth
 * serves its OpenAPI documentation.
 *
 * The actual endpoint URL is determined by the `openAPI()` plugin configuration in
 * `packages/better-auth/src/auth.shared.ts`. By default, better-auth serves the OpenAPI
 * reference at `/auth/reference`.
 *
 * If you need to change the OpenAPI docs URL:
 * 1. Configure the `openAPI({ path: "/your-custom-path" })` plugin in auth.shared.ts
 * 2. Update this constant to match the new path
 * 3. Add the new path to `allowedEndpoints.ts` in the better-auth package
 *
 * We use `endsWith()` for matching because the request path includes the API prefix
 * (e.g., "/api/auth/reference"), so we only check the suffix.
 */
const OPEN_API_ENDPOINT = "/auth/reference";

const betterAuthConstants = Object.freeze({
	OPEN_API_ENDPOINT,
});

export default betterAuthConstants;
