import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases } from "@/models/client/config"; // Import Appwrite configuration
import { db, jobs } from "@/models/name"; // Import database name

// Define the Job interface
export interface Job {
  $id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  postedOn: string; // ISO date string
  isActive: boolean;
}

// Define the initial state
interface JobState {
  jobs: Job[]; // Array of job listings
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all jobs
export const fetchJobs = createAsyncThunk<Job[], void, { rejectValue: string }>(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(db, jobs);
      return response.documents as Job[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch jobs");
    }
  }
);

// Async thunk to add a new job
export const addJob = createAsyncThunk<
  Job, // Return type
  Partial<Job>, // Payload type
  { rejectValue: string } // Error type
>("jobs/addJob", async (jobData, { rejectWithValue }) => {
  try {
    const response = await databases.createDocument(db, jobs, "unique()", jobData);
    return response as Job;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to add job");
  }
});

// Async thunk to update a job
export const updateJob = createAsyncThunk<
  Job, // Return type
  { id: string; data: Partial<Job> }, // Payload type
  { rejectValue: string } // Error type
>("jobs/updateJob", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await databases.updateDocument(db, jobs, id, data);
    return response as Job;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update job");
  }
});

// Async thunk to delete a job
export const deleteJob = createAsyncThunk<
  string, // Return type (job ID)
  string, // Payload type (job ID)
  { rejectValue: string } // Error type
>("jobs/deleteJob", async (id, { rejectWithValue }) => {
  try {
    await databases.deleteDocument(db, jobs, id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete job");
  }
});

// Create the slice
const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch jobs
    builder.addCase(fetchJobs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    });
    builder.addCase(fetchJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch jobs";
    });

    // Add job
    builder.addCase(addJob.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addJob.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs.push(action.payload); // Add the new job to the list
    });
    builder.addCase(addJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add job";
    });

    // Update job
    builder.addCase(updateJob.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateJob.fulfilled, (state, action) => {
      state.loading = false;
      const updatedJob = action.payload;
      state.jobs = state.jobs.map((job) =>
        job.$id === updatedJob.$id ? updatedJob : job
      ); // Replace the updated job in the list
    });
    builder.addCase(updateJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update job";
    });

    // Delete job
    builder.addCase(deleteJob.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteJob.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs = state.jobs.filter((job) => job.$id !== action.payload); // Remove the deleted job
    });
    builder.addCase(deleteJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete job";
    });
  },
});

// Export actions and reducer
export const { reducer: jobReducer } = jobSlice;
export default jobSlice.reducer;

