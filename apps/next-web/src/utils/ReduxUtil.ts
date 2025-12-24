import {iGenericThunkUnwrapException} from "@/customTypes/CommonServiceTypes";

/**
 * Returns thunkName by combining the reducerName and actionType with
 * the "/" as separator.
 *
 * For eg:
 * if the reducerName is "authState" and actionType is "authenticate"
 * then the returning thunkName would be "authState/authenticate".
 *
 * @param reducerName
 * @param actionType
 * @returns thunkName
 */
export function getThunkName(reducerName: string, actionType: string): string {
	return `${reducerName}/${actionType}`;
}

/**
 * Currying getThunName
 *
 * @param reducerName
 * @returns (actionType: string) => string
 */
export function curryGetThunkName(reducerName: string) {
	return (actionType: string): string => {
		return getThunkName(reducerName, actionType);
	};
}

/**
 * Parses the error message from the unwrap exception object of the thunk.
 *
 * @param error - The error object which is returned by the unwrap method of the thunk.
 * @param defaultErrorMessage - The default error message to return if the error object is not in the expected format.
 * @returns - The error message.
 */
export function parseErrorMessageFromUnwrapException(
	error: unknown,
	defaultErrorMessage = "Something went wrong!"
): string {
	// Check if the error is an object and has a message property
	if (error && typeof error === "object" && "message" in error) {
		const {message} = error as iGenericThunkUnwrapException;

		if (message && typeof message === "object" && "error" in message) {
			return message.error?.message || defaultErrorMessage;
		}
	}

	return defaultErrorMessage;
}
