import type {iResponseError} from "@customTypes/responseTypes";

/**
 * Custom error class for service layer errors.
 * Thrown when a service encounters a business logic error.
 */
export class ServiceError extends Error {
	public readonly httpStatusCode: number;
	public readonly serviceError: iResponseError;

	constructor(httpStatusCode: number, error: iResponseError) {
		super(error.message);
		this.name = "ServiceError";
		this.httpStatusCode = httpStatusCode;
		this.serviceError = error;

		// Maintains proper stack trace for where our error was thrown
		Error.captureStackTrace(this, ServiceError);
	}
}
