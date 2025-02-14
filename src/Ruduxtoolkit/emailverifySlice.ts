import { account } from "@/models/client/config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the state
interface EmailVerifyState {
  isLoading: boolean;
  error: string | null;
  success: any | null; // You can replace `any` with a more specific type if needed
  isEmailVerify: boolean;
}

// Initial state with TypeScript
const initialState: EmailVerifyState = {
  isLoading: false,
  error: null,
  success: null,
  isEmailVerify: false,
};

// Async thunk to send email verification
export const sendEmailVerify = createAsyncThunk(
  "verifyemail/sendEmailVerify",
  async (_, { rejectWithValue }) => {
    try {
      const response = await account.createVerification("http://localhost:3000/verifyemail");
      return response;
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to confirm email verification
export const updateEmailVerify = createAsyncThunk(
  "verifyemail/updateEmailVerify",
  async (data: { userId: string; secret: string }, { rejectWithValue }) => {
    try {
      const response = await account.updateVerification(data.userId, data.secret);
      return response;
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice with TypeScript
const emailVerifySlice = createSlice({
  name: "verifyemail",
  initialState,
  reducers: {
    setEmailVerify: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerify = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle sendEmailVerify pending state
      .addCase(sendEmailVerify.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle sendEmailVerify fulfilled state
      .addCase(sendEmailVerify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload;
        state.error = null;
      })
      // Handle sendEmailVerify rejected state
      .addCase(sendEmailVerify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle updateEmailVerify pending state
      .addCase(updateEmailVerify.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle updateEmailVerify fulfilled state
      .addCase(updateEmailVerify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload;
        state.error = null;
      })
      // Handle updateEmailVerify rejected state
      .addCase(updateEmailVerify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setEmailVerify } = emailVerifySlice.actions;
export default emailVerifySlice.reducer;