/**
 * All the http status codes returned by the api server(s) needs to be defined here.
 * This is used for determining the type/status of the api response after the call.
 *
 * Refer: https://www.restapitutorial.com/httpstatuscodes.html
 */
enum httpStatusCodes {
	// 2xx SUCCESS
	SUCCESS_OK = 200,
	SUCCESS_CREATED = 201,
	SUCCESS_NO_CONTENT = 204,

	// 4xx CLIENT_ERROR
	CLIENT_ERROR_BAD_REQUEST = 400,
	CLIENT_ERROR_UNAUTHORIZED = 401,
	CLIENT_ERROR_FORBIDDEN = 403,
	CLIENT_ERROR_NOT_FOUND = 404,

	// 5xx SERVER_ERROR
	SERVER_ERROR_INTERNAL_SERVER_ERROR = 500,
	SERVER_ERROR_SERVICE_UNAVAILABLE = 503,
}

export {httpStatusCodes};
