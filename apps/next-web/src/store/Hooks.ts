import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

import {AppDispatch, RootState} from "@/store/index";

/**
 * Use throughout your app instead of plain `useDispatch`
 * @returns
 */
const useAppDispatch = () => {
	return useDispatch<AppDispatch>();
};

/**
 * Use throughout your app instead of plain `useSelector`
 */
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {useAppDispatch, useAppSelector};
