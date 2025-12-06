import type {
	iGenericServiceResult,
	iResponseMeta,
	NullableServiceError,
} from "@customTypes/serviceTypes";
import type {httpStatusCodes} from "@customTypes/networkTypes";
import type {NullableString} from "@customTypes/commonTypes";

/**
 * Builds result object for the route layer.
 *
 * @param isSuccess
 * @param error
 * @param data
 * @returns result
 */
function buildResult<SuccessResultType>(
	isSuccess: boolean,
	httpStatusCode: httpStatusCodes,
	uniqueRequestId: NullableString,
	error: NullableServiceError | undefined,
	data?: SuccessResultType | undefined | null
): iGenericServiceResult<SuccessResultType | null> {
	let errorObject = null;
	if (error) {
		errorObject = error;

		if (!errorObject.validationErrors) {
			errorObject.validationErrors = null;
		}
	}

	const responseMeta: iResponseMeta = {
		URID: uniqueRequestId,
	};

	return {
		isSuccess,
		httpStatusCode,
		meta: responseMeta,
		error: errorObject,
		data: data || null,
	};
}

export default {
	buildResult,
};
