// features/auth/authSlice.ts
import { account } from "@/models/client/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OAuthProvider } from "appwrite";

// Define types
interface User {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  prefs?: Record<string, any>; // Custom preferences (e.g., role)
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean; // Indicates if the user is authenticated
  error: string | null;
}

// Async thunk for user signup
export const signupUser = createAsyncThunk<
  { status: string; message: string }, // Return type
  { email: string; password: string; name: string; role: string }, // Payload type
  { rejectValue: string } // Error type
>("auth/signup", async ({ email, password, name, role }, { rejectWithValue, dispatch }) => {
  try {
    // Step 1: Create the user
    await account.create("unique()", email, password, name);

    await dispatch(loginUser({ email, password })).unwrap();
    // Step 2: Update the user's preferences (role)
    await account.updatePrefs({ role });

    // Step 3: Automatically log in the user

    // Return success status and message
    return { status: "success", message: "User created and logged in successfully" };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to create user");
  }
});

// Async thunk for user login
export const loginUser = createAsyncThunk<
  { user: User; message: string }, // Return type
  { email: string; password: string }, // Payload type
  { rejectValue: string } // Error type
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    // Step 1: Create an email-password session
    await account.createEmailPasswordSession(email, password);

    // Step 2: Fetch the user details
    const user = await account.get();

    // Return success status and message
    return { user, message: "Login successful" };
  } catch (error: any) {
    return rejectWithValue(error.message || "Invalid email or password");
  }
});

// Async thunk for Google login
export const loginWithGoogle = createAsyncThunk<
  {  message: string },
  {role?:string},
  { rejectValue: string }
>("auth/loginWithGoogle", async ({role}, { rejectWithValue }) => {
  try {
    const userrole:string = role === "job seeker" ? "User" : "jobprovider"
    // Step 1: Create OAuth session
    // Go to OAuth provider login page
await account.createOAuth2Session(
  OAuthProvider.Google, // provider
  `https://online-job-platform.vercel.app/${userrole}/dashboard`, // redirect here on success
  'https://online-job-platform.vercel.app/failed', // redirect here on failure
  ['email', 'profile'] // scopes (optional)
);

    // Step 2: Fetch the user details
    // const user = await account.get();

    return {  message: "Google login successful" };
  } catch (error: any) {
    return rejectWithValue(error.message || "Google login failed");
  }
});

export const updateUserPreferences = createAsyncThunk<
  { message: string },
  { role: string },
  { rejectValue: string }
>("auth/updateUserPreferences", async ({ role }, { rejectWithValue }) => {
  try {
    await account.updatePrefs({ role });
    return { message: "User preferences updated successfully" };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update preferences");
  }
});



// Async thunk for user logout
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Delete the current session
      await account.deleteSession("current");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to log out");
    }
  }
);

// Async thunk for getting the current user
export const getUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch the current user details
      const response = await account.get();
      console.log("for check",response)
      return response as User;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.isAuthenticated = true; // User is authenticated after signup
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Signup failed";
        state.isAuthenticated = false;
      })

      // Handle login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user; // Store the user data
        state.isAuthenticated = true; // User is authenticated after login
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Handle logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false; // User is no longer authenticated
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Logout failed";
      })

      // Handle get user
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Store the user data
        state.isAuthenticated = true; // User is authenticated if user data exists
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch user";
        state.isAuthenticated = false;
      })

        // handle for google signup or login 
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Google login failed";
        state.isAuthenticated = false;
      })

      .addCase(updateUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update preferences";
      });
  },
});

// Export actions and reducer
export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;