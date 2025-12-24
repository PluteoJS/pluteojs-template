import {AxiosError, AxiosInstance, AxiosResponse} from "axios";

import type {StoreType} from "@/store/index";

import {httpStatusCodes} from "@/customTypes/NetworkTypes";

/**
 * Mapping all the responseInterceptors defined as closures inside this function
 * to the axios-instance apiServer.
 *
 * Defined responseInterceptor closures needs to be registered to the constant object
 * axiosResponseInterceptors in order to get mapped.
 *
 * @param store
 * @param apiServer
 */
function PluteoJSServerAxiosResponseInterceptors(
	store: StoreType | null,
	apiServer: AxiosInstance
): void {
	/*
		Response Interceptor which determines whether the error caused by authorization
		token expiration or not in case of an error reason.

		If yes, it attempts to get a new authorization token issued by invoking the
		designated api. If the refresh attempt is successful, then it will retry the
		originally failed request with the newly issued authorization token.
	 */
	const responseAuthTokenExpireInterceptor = {
		onFulfilled: async (
			response: AxiosResponse
		): Promise<AxiosResponse<unknown, unknown>> => {
			return response;
		},

		onRejected: async (reason: AxiosError): Promise<unknown> => {
			if (store && reason && reason.response) {
				const {status: errorHttpStatus} = reason.response;

				/*
					Returns any error that is not a type of httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED
				*/
				if (errorHttpStatus !== httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED) {
					return new Promise((resolve, reject) => {
						reject(reason);
					});
				}

				/*
					Renewing the expired authorization token with the refresh token
					and attempting to retry the originally failed request.
				*/

				// TODO: add implementation for renewal
				// const originalRequestConfig = reason.config;
				// // retrying the originally failed request
				// return apiServer(originalRequestConfig);
				// }
			}

			return new Promise((resolve, reject) => {
				reject(reason);
			});
		},
	};

	// TODO: add responseNetworkFailureInterceptor

	/**
	 * All response-interceptors should be registered here.
	 *
	 * eg: {
	 *     responseAuthorizationTokenExpireInterceptor: responseAuthorizationTokenExpireInterceptor
	 * }
	 */
	const axiosResponseInterceptors = {
		responseAuthTokenExpireInterceptor,
	};

	/**
	 * Extracting and mapping each responseInterceptor defined inside
	 * AxiosInterceptors.responseInterceptors with the axios-instance
	 * apiServer.
	 */
	Object.values(axiosResponseInterceptors).forEach(
		(responseInterceptor: {
			onFulfilled: (
				response: AxiosResponse
			) => Promise<AxiosResponse<unknown, unknown>>;
			onRejected: (reason: AxiosError) => Promise<unknown>;
		}) => {
			apiServer.interceptors.response.use(
				responseInterceptor.onFulfilled,
				responseInterceptor.onRejected
			);
		}
	);
}

export default PluteoJSServerAxiosResponseInterceptors;
