import {APIResponse, httpStatusCodes} from "@/customTypes/NetworkTypes";
import {iGenericResponse} from "@/customTypes/CommonServiceTypes";

/**
 * This function helps the api service functions to return
 * a standard result-object.
 *
 * @param error
 * @param httpStatusCode
 * @param message
 * @param data
 * @returns
 */
function buildResult<SuccessResultType>(
	error: unknown,
	httpStatusCode: httpStatusCodes,

	message: unknown,

	data: iGenericResponse<SuccessResultType> | null
): APIResponse<SuccessResultType> {
	return {
		error: error || null,
		httpStatusCode: httpStatusCode || null,
		message: message || null,
		data: data || null,
	};
}

const NetworkUtil = {
	buildResult,
};

export default NetworkUtil;
