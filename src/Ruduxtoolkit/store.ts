// Ruduxtoolkit/store.ts
import { configureStore } from "@reduxjs/toolkit";
import registerSlice from "./registerSlice";
import authSlice from "./authSlice";
import candidateSlice from "./candidateSlice";
import emailVerifySlice from './emailverifySlice';
import jobSlice from './jobSlice';
import companySlice from './companySlice';
import applicationSlice from './applicationSlice';
import resetpasswordSlice from './resetpasswordSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    registeractive: registerSlice,
    auth: authSlice,
    candidate: candidateSlice,
    emailverify:emailVerifySlice,
    job:jobSlice,
    company:companySlice,
    application:applicationSlice,
    forgotpassword:resetpasswordSlice,

  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the store
export default store;