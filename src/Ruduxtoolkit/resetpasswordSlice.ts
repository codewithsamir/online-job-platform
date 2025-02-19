import { account } from "@/models/client/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ForgotpasswordState {
  isLoading: boolean;
  error: string | null;
  success: any | null;
}

// Forgot Password: Sends recovery email
export const updatepassword = createAsyncThunk(
  "updatepassword",
  async (data: { email: string }, { rejectWithValue }) => {
    console.log(data);
    const { email } = data;

    try {
      // Await the response to ensure proper error handling
      const response = await account.createRecovery(email, "https://online-job-platform.vercel.app/passwordreset");
      return response;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message || "An error occurred while updating password.");
    }
  }
);

// Confirm Password Update: Updates the password with provided ID, secret, and new password
export const confirmupdatapassword = createAsyncThunk(
  "confirmupdatepassword",
  async (data: { id: string; secret: string; password: string }, { rejectWithValue }) => {
    try {
      // Await the response to ensure proper error handling
      const response = await account.updateRecovery(data.id, data.secret, data.password);
      return response;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message || "An error occurred while confirming password update.");
    }
  }
);

const forgotpasswordSlice = createSlice({
  name: "forgotpassword",
  initialState: {
    isLoading: false,
    error: null,
    success: null,
  } as ForgotpasswordState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling updatepassword
      .addCase(updatepassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatepassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload;
        state.error = null;
      })
      .addCase(updatepassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handling confirmupdatapassword
      .addCase(confirmupdatapassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmupdatapassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload;
        state.error = null;
      })
      .addCase(confirmupdatapassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default forgotpasswordSlice.reducer;
