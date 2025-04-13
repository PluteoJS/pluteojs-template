/**
 * NOTE: Please don't import "@config" to this file as it will cause
 * circular dependency.
 */

import {serverModes} from "@constants/serverConstants";
import type {NullableString} from "@pluteojs/types/modules/commonTypes";

/**
 * Returns the appropriate envFilePath depending on the value of
 * process.env.NODE_ENV.
 *
 * By default it will return "./.env.development"
 *
 * @returns envFilePath
 */
const getEnvFilePath = (): string => {
	let enfFilePath: NullableString = null;

	switch (process.env.NODE_ENV) {
		case serverModes.PRODUCTION:
			enfFilePath = "./.env.production";

			break;

		case serverModes.STAGING:
			enfFilePath = "./.env.staging";
			break;

		case serverModes.DEVELOPMENT:
			enfFilePath = "./.env.development";
			break;

		default: {
			enfFilePath = "./.env.development.local";
		}
	}

	return enfFilePath;
};

export default {
	getEnvFilePath,
};
