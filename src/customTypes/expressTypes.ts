import {Router, Request, Response} from "express";

import {
	ParamsDictionary,
	Query,
	Send,
} from "@customTypes/expressServeStaticCore";
import {NullableServiceError} from "@customTypes/commonServiceTypes";

type RouteType = (apiRouter: Router) => void;

/**
 * Express Request interface with optional body
 * generic.
 *
 * NOTE: "T = void" makes the T generic optional. Which means
 * if the request doesn't have body, we can use just use
 * req: iRequest instead of req: iRequest<{}>
 */
interface iRequest<T = void> extends Request {
	body: T;
}

/**
 * Express Request interface with query generic.
 */
interface iRequestQuery<T extends Query> extends Request {
	query: T;
}

/**
 * Express Request interface with params generic.
 */
interface iRequestParams<T extends ParamsDictionary> extends Request {
	params: T;
}

/**
 * Express Response body interface with ResDataType generic.
 */
interface iResponseBody<ResDataType> {
	isSuccess: boolean;
	httpStatusCode: number;
	error: NullableServiceError;
	data: ResDataType | null;
}

/**
 * Express Response interface with ResDataType generic.
 */
interface iResponse<ResDataType> extends Response {
	json: Send<iResponseBody<ResDataType>, this>;
}

export type {RouteType, iRequest, iRequestQuery, iRequestParams, iResponse};

export {};
