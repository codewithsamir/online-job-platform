import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases } from "@/models/client/config"; // Import Appwrite configuration
import { db, jobs, companies } from "@/models/name"; // Import database and collection names
import { Query } from "appwrite"; // Import Appwrite Query for filtering

// Define the Job interface
export interface Job {
  $id: string;
  title: string;
  description: string;
  company: string; // Company ID
  location: string;
  salary: number;
  
  postedDate: string; // ISO date string
  isActive: boolean;
  postedBy: string; // User ID of the job poster
}

// Define the Company interface
export interface Company {
  $id: string;
  name: string;
  description?: string;
  industry: string;
  website?: string;
  logoUrl?: string; // URL of the company logo
}

// Extend the Job interface to include company profile data
export interface JobWithCompany extends Job {
  companyProfile?: Company | null; // Optional company profile data
  companyName?: string; // Optional company name for filtering purposes
}

// Define the initial state
interface JobState {
  jobs: JobWithCompany[]; // Array of job listings with optional company profile data
  userJobs: Job[]; // Array of jobs posted by the current user
  selectedJob: JobWithCompany | null; // Selected job details (for job detail page)
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: JobState = {
  jobs: [],
  userJobs: [], // New state to store jobs posted by the current user
  selectedJob: null, // To store the selected job's details
  loading: false,
  error: null,
};

// Async thunk to fetch all jobs with company profile data
export const fetchJobs = createAsyncThunk<JobWithCompany[], void, { rejectValue: string }>(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(db, jobs);
      const jobsData = response.documents as unknown as Job[];

      // Fetch company profiles for each job
      const jobsWithCompany = await Promise.all(
        jobsData.map(async (job) => {
          try {
            const companyResponse = await databases.listDocuments(db, companies, [
              Query.equal("createdBy",job.postedBy)
            ]);
            const companyProfile = companyResponse.documents[0] as unknown as Company;
            return { ...job, companyProfile };
          } catch (error) {
            console.error(`Failed to fetch company profile for job ${job.$id}:`, error);
            return job; // Return the job without company profile if fetching fails
          }
        })
      );

      return jobsWithCompany;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch jobs");
    }
  }
);

// Async thunk to fetch a single job by $id with company profile data
export const fetchJobById = createAsyncThunk<JobWithCompany, string, { rejectValue: string }>(
  "jobs/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      // Fetch the job document
      const jobResponse = await databases.getDocument(db, jobs, jobId);
      const job = jobResponse as unknown as Job;

      // Fetch the company profile associated with the job's postedBy field
      const companyProfileResponse = await databases.listDocuments(db, companies, [
        Query.equal("createdBy", job.postedBy),
      ]);

      // Extract the first company profile from the response
      const companyProfile = companyProfileResponse.documents[0] as unknown as Company // Assuming there's only one matching company

      // Combine job and company profile data
      const jobWithCompany: JobWithCompany = {
        ...job,
        companyProfile
      };

      return jobWithCompany;
    } catch (error: any) {
      console.error("Error fetching job details:", error.message);
      return rejectWithValue(error.message || "Failed to fetch job details");
    }
  }
);

// Async thunk to fetch jobs posted by the current user
export const fetchJobsByUser = createAsyncThunk<Job[], void, { rejectValue: string; getState: any }>(
  "jobs/fetchJobsByUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get the current user's ID from the Redux state
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }
      // Fetch jobs where postedBy matches the current user's ID
      const response = await databases.listDocuments(db, jobs, [
        Query.equal("postedBy", auth.user.$id),
      ]);
      return response.documents as unknown as Job[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user jobs");
    }
  }
);

// Async thunk to add a new job
export const addJob = createAsyncThunk<
  Job, // Return type
  Partial<Job>, // Payload type
  { rejectValue: string; getState: any } // Error type
>("jobs/addJob", async (jobData, { getState, rejectWithValue }) => {
  try {
    // Get the current user's ID from the Redux state
    const { auth }: { auth: { user: { $id: string } } } = getState() as {
      auth: { user: { $id: string } };
    };
    if (!auth.user?.$id) {
      throw new Error("User not authenticated");
    }
    // Add the current user's ID to the job data
    
    
    const jobPayload = {
      ...jobData,
      postedBy: auth.user.$id, // Automatically set the postedBy field
      postedDate: new Date().toISOString(), // Set the current date as postedOn
    };
    const response = await databases.createDocument(db, jobs, "unique()", jobPayload);
    return response as unknown as Job;
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
    return response as unknown as Job;
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
    // Fetch all jobs with company profile data
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

    // Fetch job by ID with company profile data
    builder.addCase(fetchJobById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchJobById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedJob = action.payload;
    });
    builder.addCase(fetchJobById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch job details";
    });

    // Fetch jobs posted by the current user
    builder.addCase(fetchJobsByUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchJobsByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userJobs = action.payload; // Store jobs posted by the user
    });
    builder.addCase(fetchJobsByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch user jobs";
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