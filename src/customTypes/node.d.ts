declare namespace NodeJS {
	/*
		NOTE: The naming-convention rule has been disabled for this line because
		ProcessEnv is part of @types/node and can't be renamed to
		iProcessEnv
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export interface ProcessEnv {
		CUSTOM_TEMPLATE_SPECIFIC_ENV_VAR: string;
	}
}
