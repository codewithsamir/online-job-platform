// app/hooks.ts
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { RootState } from "./store";

// Custom hook for typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom hook for typed selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;