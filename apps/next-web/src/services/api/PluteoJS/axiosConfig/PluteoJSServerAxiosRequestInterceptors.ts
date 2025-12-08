import {AxiosInstance} from "axios";

import type {StoreType} from "@/store/index";

import type {InternalAxiosRequestConfig} from "axios";

/**
 * Mapping all the requestInterceptors defined as closures inside this function
 * to the axios-instance apiServer.
 *
 * Defined requestInterceptor closures needs to be registered to the constant object
 * axiosRequestInterceptors in order to get mapped.
 *
 * @param store
 * @param apiServer
 */
function PluteoJSServerAxiosRequestInterceptors(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	store: StoreType | null = null,
	apiServer: AxiosInstance
): void {
	/**
	 * Request Interceptor for adding Authorization: Bearer token by taking token from authState in redux store.
	 * @param {AxiosRequestConfig} config
	 */
	function requestAuthorizationInterceptor(
		config: InternalAxiosRequestConfig
	): InternalAxiosRequestConfig {
		// setting authorization header
		return {
			...config,
			// TODO: set authorization header here
			// headers: {
			//   ...config.headers,
			//   Authorization: `Bearer ${store?.getState().auth.token}`,
			// },
		};
	}
	/**
	 * All request-interceptors should be registered here.
	 *
	 * eg: {
	 *     requestAuthorizationInterceptor: requestAuthorizationInterceptor
	 * }
	 */
	const axiosRequestInterceptors = {
		requestAuthorizationInterceptor,
	};

	/**
	 * Extracting and mapping each requestInterceptors with the axios-instance
	 * apiServer.
	 */
	Object.values(axiosRequestInterceptors).forEach((requestInterceptor) => {
		return apiServer.interceptors.request.use(requestInterceptor);
	});
}

export default PluteoJSServerAxiosRequestInterceptors;
