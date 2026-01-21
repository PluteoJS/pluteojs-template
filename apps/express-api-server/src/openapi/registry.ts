import {OpenAPIRegistry, extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {z} from "zod";

// Extend Zod with OpenAPI methods (.openapi())
extendZodWithOpenApi(z);

// Shared registry instance for all route documentation
export const registry = new OpenAPIRegistry();

// Register bearer auth security scheme
registry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
	description: "JWT access token",
});
