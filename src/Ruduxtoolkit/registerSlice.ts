import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the state
interface RegisterActiveState {
  isActivelogin: boolean;
  isActivecategori: boolean;
  isActivejobseeker: boolean;
  isActivejobprovider: boolean;
  isActivechatbot: boolean;
  isActiveforgotpassword: boolean;
}

// Initial state with proper typing
const initialState: RegisterActiveState = {
  isActivelogin: false,
  isActivecategori: false,
  isActivejobseeker: false,
  isActivejobprovider: false,
  isActivechatbot: false,
  isActiveforgotpassword: false,
};

// Create the slice with TypeScript
const registerSlice = createSlice({
  name: "registeractive",
  initialState,
  reducers: {
    loginActive: (state, action: PayloadAction<boolean>) => {
      state.isActivelogin = action.payload;
    },
    categoriActive: (state, action: PayloadAction<boolean>) => {
      state.isActivecategori = action.payload;
    },
    jobseekerActive: (state, action: PayloadAction<boolean>) => {
      state.isActivejobseeker = action.payload;
    },
    jobproviderActive: (state, action: PayloadAction<boolean>) => {
      state.isActivejobprovider = action.payload;
    },
    chatbotActive: (state, action: PayloadAction<boolean>) => {
      state.isActivechatbot = action.payload;
    },
    forgotpasswordActive: (state, action: PayloadAction<boolean>) => {
      state.isActiveforgotpassword = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  loginActive,
  categoriActive,
  jobseekerActive,
  jobproviderActive,
  chatbotActive,
  forgotpasswordActive,
} = registerSlice.actions;

export default registerSlice.reducer;