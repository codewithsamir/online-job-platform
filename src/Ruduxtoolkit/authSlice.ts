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
  isLoadingUser: boolean;   // Loading for fetching user
  isLoading: boolean; // Loading for login/signup/logout/update prefs
  isAuthenticated: boolean;
  error: string | null;
}

// ----------------- Async Thunks ------------------

// Signup user
export const signupUser = createAsyncThunk<
  { status: string; message: string },
  { email: string; password: string; name: string; role: string },
  { rejectValue: string }
>("auth/signup", async ({ email, password, name, role }, { rejectWithValue, dispatch }) => {
  try {
    await account.create("unique()", email, password, name);
    await dispatch(loginUser({ email, password })).unwrap();
    await account.updatePrefs({ role });
    return { status: "success", message: "User created and logged in successfully" };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to create user");
  }
});

// Login user
export const loginUser = createAsyncThunk<
  { user: User; message: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    return { user, message: "Login successful" };
  } catch (error: any) {
    return rejectWithValue(error.message || "Invalid email or password");
  }
});

// Google login
export const loginWithGoogle = createAsyncThunk<
  { message: string },
  { role?: string },
  { rejectValue: string }
>("auth/loginWithGoogle", async ({ role }, { rejectWithValue }) => {
  try {
    const userrole: string = role === "job seeker" ? "User" : "Jobprovider";
    await account.createOAuth2Session(
      OAuthProvider.Google,
      `https://online-job-platform.vercel.app/${userrole}/dashboard`,
      "https://online-job-platform.vercel.app/failed",
      ["email", "profile"]
    );
    return { message: "Google login successful" };
  } catch (error: any) {
    return rejectWithValue(error.message || "Google login failed");
  }
});

// Update user preferences
export const updateUserPreferences = createAsyncThunk<
  { message: string },
  { role: string; isJobProvider?: boolean },
  { rejectValue: string }
>("auth/updateUserPreferences", async (data, { rejectWithValue }) => {
  try {
    await account.updatePrefs(data);
    return { message: "User preferences updated successfully" };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update preferences");
  }
});

// Logout user
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await account.deleteSession("current");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to log out");
    }
  }
);

// Get current user
export const getUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      await account.getSession("current");
      const response = await account.get();
      return response as User;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

// ----------------- Slice ------------------

const initialState: AuthState = {
  user: null,
  isLoadingUser: false,
  isLoadingAction: false,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.isLoadingUser = false;
      state.isLoadingAction = false;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoadingAction = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Signup failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoadingAction = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoadingAction = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.error = action.payload || "Logout failed";
      })

      // Google login
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state) => {
        state.isLoadingAction = false;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Google login failed";
      })

      // Update preferences
      .addCase(updateUserPreferences.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state) => {
        state.isLoadingAction = false;
        state.error = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.error = action.payload || "Failed to update preferences";
      })

      // Get user
      .addCase(getUser.pending, (state) => {
        state.isLoadingUser = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoadingUser = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoadingUser = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Failed to fetch user";
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
