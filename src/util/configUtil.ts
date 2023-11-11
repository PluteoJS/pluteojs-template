/**
 * NOTE: Please don't import "@config" to this file as it will cause
 * circular dependency.
 */
import {serverModes} from "@constants/serverConstants";
import {NullableString} from "@customTypes/commonTypes";

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

		default: {
			enfFilePath = "./.env.development";
		}
	}

	return enfFilePath;
};

export default {
	getEnvFilePath,
};
