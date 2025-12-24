import {createSlice} from "@reduxjs/toolkit";

import {iExampleState, REDUCER_NAME} from "./Types";

const initialState: iExampleState = {
	message: "Hello from PluteoJS",
};

export const exampleSlice = createSlice({
	name: REDUCER_NAME,
	initialState,
	reducers: {
		resetExampleState: () => {
			return initialState;
		},
	},
});

export const {resetExampleState} = exampleSlice.actions;

export default exampleSlice.reducer;
