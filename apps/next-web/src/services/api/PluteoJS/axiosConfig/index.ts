import axios from "axios";

import type {StoreType} from "@/store/index";

import AxiosResponseInterceptors from "@/services/api/commonInterceptors/AxiosResponseInterceptors";
import PluteoJSServerAxiosRequestInterceptors from "@/services/api/PluteoJS/axiosConfig/PluteoJSServerAxiosRequestInterceptors";
import PluteoJSServerAxiosResponseInterceptors from "@/services/api/PluteoJS/axiosConfig/PluteoJSServerAxiosResponseInterceptors";

import {axiosRequestConfig} from "./AxiosServiceConstants";

/**
 * Creating axios instance for handling api service requests with
 * apiServerConfig.
 *
 * For updating any of the request configuration or for reviewing
 * the current configuration, please refer AxiosServiceConstants.axiosRequestConfig.
 */
const apiServer = axios.create(axiosRequestConfig);

/**
 * Injects the redux store to the local variable reduxStore which gets used
 * inside the axios interceptors.
 *
 * For more details, please refer:
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 *
 * @param store
 */
export const injectStore = (store: StoreType): void => {
	// registering common axios response interceptors
	AxiosResponseInterceptors(store, apiServer);

	// registering axios request interceptors specific to PluteoJS Server
	PluteoJSServerAxiosRequestInterceptors(store, apiServer);

	// registering axios response interceptors specific to PluteoJS Server
	PluteoJSServerAxiosResponseInterceptors(store, apiServer);
};

export {apiServer};
