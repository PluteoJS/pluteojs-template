"use client";

import React from "react";

import {Provider} from "react-redux";

import AppUtil from "@/utils/AppUtil";
import {injectStore} from "@/services/api";

import store from ".";

export function ReduxProvider({children}: {children: React.ReactNode}) {
	/**
	 * Injects redux-store to the local variable reduxStore which gets used
	 * inside the axios interceptors.
	 *
	 * Currently we're using this only in development environment.
	 */
	if (AppUtil.isDev()) {
		injectStore(store);
	}

	return <Provider store={store}>{children}</Provider>;
}
