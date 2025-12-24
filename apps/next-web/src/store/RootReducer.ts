import {combineReducers} from "@reduxjs/toolkit";

import exampleReducer from "@/store/example/ExampleSlice";

// Combine multiple reducers into a single root reducer
const rootReducer = combineReducers({
	exampleReducer,
});

export default rootReducer;
