import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, storage } from "@/models/client/config"; // Import Appwrite configuration
import { db, applications, resumeBucket } from "@/models/name"; // Import database, collection, and storage bucket names
import { Query } from "appwrite";

// Define the Application interface
export interface Application {
  $id: string;
  jobId: string; // ID of the job being applied to
  candidateId: string; // ID of the candidate applying
  resumeUrl?: string; // URL of the uploaded resume
  resumeId?: string; // ID of the uploaded resume file in the storage bucket
  applicationDate: string; // ISO date string
  status: string; // e.g., "Pending", "Accepted", "Rejected"
}

// Define the initial state
interface ApplicationState {
  applications: Application[]; // Array of job applications
  loading: boolean;
  error: string | null;
}

// Initial state with proper structure
const initialState: ApplicationState = {
  applications: [],
  loading: false,
  error: null,
};

// Helper function to generate file URLs
const generateFileUrl = (bucketId: string, fileId: string) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

// Async thunk to fetch all applications for the current user
export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (_, { getState }) => {
    try {
      // Get the current user from the Redux state
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }
      // Fetch applications where candidateId matches the current user's ID
      const response = await databases.listDocuments(db, applications, [
        Query.equal("candidateId", auth.user.$id),
      ]);
      return response.documents as Application[];
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch applications");
    }
  }
);

// Async thunk to add a new application
export const addApplication = createAsyncThunk(
  "applications/addApplication",
  async (
    applicationData: Omit<Application, "$id" | "resumeUrl" | "resumeId"> & {
      resumeFile?: File; // Resume file to upload
    },
    { getState }
  ) => {
    try {
      // Get the current user from the Redux state
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }

      // Add the current user's ID as the candidateId
      applicationData.candidateId = auth.user.$id;

      // Upload resume file to the resume bucket
      let resumeUrl = "";
      let resumeId = "";
      if (applicationData.resumeFile) {
        const resumeResponse = await storage.createFile(
          resumeBucket,
          "unique()", // Auto-generate file ID
          applicationData.resumeFile
        );
        resumeId = resumeResponse.$id;
        resumeUrl = generateFileUrl(resumeBucket, resumeId); // Generate URL
      }
  const {applicationDate,candidateId,jobId} = applicationData
      // Prepare application data with URLs and IDs
      const applicationPayload = {
        applicationDate,candidateId,jobId,
        resumeUrl,
        resumeId,
        
        status: "Pending", // Default status
      };

      // Create the application document in the database
      const response = await databases.createDocument(
        db,
        applications,
        "unique()", // Auto-generate document ID
        applicationPayload
      );
      return response as Application; // Return the newly created application
    } catch (error: any) {
      throw new Error(error.message || "Failed to add application");
    }
  }
);

// Async thunk to update an application
export const updateApplication = createAsyncThunk(
  "applications/updateApplication",
  async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<Omit<Application, "$id" | "resumeUrl" | "resumeId">> & {
      resumeFile?: File; // Optional new resume file
    },
  }) => {
    try {
      // If a new resume is uploaded, update it in the resume bucket
      let resumeUrl = data.resumeUrl;
      let resumeId = data.resumeId;
      if (data.resumeFile) {
        const resumeResponse = await storage.createFile(
          resumeBucket,
          "unique()", // Auto-generate file ID
          data.resumeFile
        );
        resumeId = resumeResponse.$id;
        resumeUrl = generateFileUrl(resumeBucket, resumeId); // Generate URL
      }

      // Prepare updated application data with URLs and IDs
      const updatedData = {
        ...data,
        resumeUrl,
        resumeId,
      };

      // Update the application document in the database
      const response = await databases.updateDocument(db, applications, id, updatedData);
      return response as Application; // Return the updated application
    } catch (error: any) {
      throw new Error(error.message || "Failed to update application");
    }
  }
);

// Async thunk to delete an application
export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",
  async (id: string) => {
    try {
      await databases.deleteDocument(db, applications, id);
      return id; // Return the ID of the deleted application
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete application");
    }
  }
);

// Create the slice
const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch applications
    builder.addCase(fetchApplications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchApplications.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = action.payload;
    });
    builder.addCase(fetchApplications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch applications";
    });

    // Add application
    builder.addCase(addApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.applications.push(action.payload); // Add the new application to the list
    });
    builder.addCase(addApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add application";
    });

    // Update application
    builder.addCase(updateApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateApplication.fulfilled, (state, action) => {
      state.loading = false;
      const updatedApplication = action.payload;
      state.applications = state.applications.map((app) =>
        app.$id === updatedApplication.$id ? updatedApplication : app
      ); // Replace the updated application in the list
    });
    builder.addCase(updateApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update application";
    });

    // Delete application
    builder.addCase(deleteApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = state.applications.filter(
        (app) => app.$id !== action.payload
      ); // Remove the deleted application from the list
    });
    builder.addCase(deleteApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete application";
    });
  },
});

// Export actions and reducer
export default applicationSlice.reducer;