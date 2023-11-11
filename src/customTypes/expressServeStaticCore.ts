/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Redefining express-serve-static-core types as the importing from
 * it is not working properly.
 */
import {Response} from "express";
import {ParsedQs} from "qs";

type Query = ParsedQs;

interface ParamsDictionary {
	[key: string]: string;
}

type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;

export type {Query, ParamsDictionary, Send};
