import {AxiosRequestConfig} from "axios";

/**
 * The base url of the api server's endpoint needs to be configured here.
 *
 * NOTE: This has to be managed by a build flavor configuration files
 * such as environment files or via a remote configuration manager.
 */
const API_SERVER_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3020";

/**
 * The request timeout of the api server needs to be configured here.
 *
 * NOTE: This has to be managed by a build flavor configuration files
 * such as environment files or via a remote configuration manager.
 */
const API_SERVER_REQUEST_TIMEOUT = Number(
	process.env.NEXT_PUBLIC_API_TIMEOUT || 15000
);

/**
 * All basic axios request-configurations needs to be set here.
 * This will used inside the services/api/index.ts file while
 * creating axios service instance to handle api calls.
 */
export const axiosRequestConfig: AxiosRequestConfig =
	Object.freeze<AxiosRequestConfig>({
		// withCredentials: true,
		baseURL: API_SERVER_BASE_URL,

		/**
		 * The timeout for axios is set in milliseconds.
		 * Here, it's set to 15 seconds (15000ms) as the default value if
		 * the API_SERVER_REQUEST_TIMEOUT is not set in the
		 * environment files.
		 */
		timeout: API_SERVER_REQUEST_TIMEOUT || 15000,
	});

/**
 * All the application service api endpoints should be defined here and never
 * directly define and use apiEndpoints as the baseURL is configured based on
 * the build flavor or other remote configuration managers.
 *
 * While defining endpoints here, kindly note that the part after the base url
 * should be added here and shouldn't include the host/baseURL part.
 *
 * Kindly refer the below examples for more details:
 *
 * If the endpoint is "https://dev.exampleapiserver.tld/api/v1/login" , then it
 * should be split as below:
 * API_SERVER_BASE_URL =  "https://dev.exampleapiserver.tld/api/v1"
 * apiEndpoints = {
 *     authentication: {
 *         login: "/login"
 *     }
 * }
 *
 */
export const apiEndpoints = Object.freeze({
	health: {
		/**
		 * The endpoint to check the health of the API server.
		 * This is a GET request.
		 */
		check: () => {
			return "/health";
		},
	},
	example: {
		/**
		 * Example endpoint for demonstration.
		 * This is a GET request.
		 */
		getDetails: () => {
			return "/api/example";
		},
	},
});
