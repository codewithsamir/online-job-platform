// Ruduxtoolkit/store.ts
import { configureStore } from "@reduxjs/toolkit";
import registerSlice from "./registerSlice";
import authSlice from "./authSlice";
import candidateSlice from "./candidateSlice";

// Configure the Redux store
const store = configureStore({
  reducer: {
    registeractive: registerSlice,
    auth: authSlice,
    candidate: candidateSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the store
export default store;