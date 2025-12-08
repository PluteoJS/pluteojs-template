import {configureStore} from "@reduxjs/toolkit";
import {createLogger} from "redux-logger";

import rootReducer from "@/store/RootReducer";

// Redux logger
const reduxLogger = createLogger({
	collapsed: true,
	duration: true,
});

// Configure the Redux store
const store = configureStore({
	reducer: rootReducer,
	// Note: It's often useful to enable Redux DevTools for development.
	// You can conditionally enable it based on the environment if needed.
	devTools: false,
	middleware: (getDefaultMiddleware) => {
		const middleware = getDefaultMiddleware();

		if (process.env.NODE_ENV === "development") {
			middleware.push(reduxLogger as ReturnType<typeof createLogger>);
		}

		return middleware;
	},
});

// Types related to the store
type StoreType = typeof store;
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export default store;

export type {StoreType, RootState, AppDispatch};
