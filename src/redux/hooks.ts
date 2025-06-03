/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDispatch,
  type TypedUseSelectorHook,
  useSelector,
} from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
