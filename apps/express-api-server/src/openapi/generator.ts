import {OpenApiGeneratorV31} from "@asteasolutions/zod-to-openapi";

import {registry} from "./registry";
import config from "@config";

/**
 * Generates the OpenAPI 3.1 document from the registry.
 *
 * @returns The OpenAPI document object
 */
export function generateOpenApiDocument(): ReturnType<OpenApiGeneratorV31["generateDocument"]> {
	const generator = new OpenApiGeneratorV31(registry.definitions);

	return generator.generateDocument({
		openapi: "3.1.0",
		info: {
			title: "PluteoJS Express API",
			version: "0.0.1",
			description: "Express API Server built with PluteoJS template",
		},
		servers: [
			{
				url: `http://localhost:${config.port}`,
				description: "Local development server",
			},
		],
	});
}
