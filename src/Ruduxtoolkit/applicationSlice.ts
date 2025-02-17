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
  applicationsByCandidate: Application[]; // Applications filtered by candidate ID
  applicationsByJob: Application[]; // Applications filtered by job ID
  loading: boolean;
  isupdate: boolean;
  error: string | null;
}

// Initial state with proper structure
const initialState: ApplicationState = {
  applicationsByCandidate: [],
  applicationsByJob: [],
  loading: false,
  isupdate: false,
  error: null,
};

// Helper function to generate file URLs
const generateFileUrl = (bucketId: string, fileId: string): string => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

// Helper function to map Document to Application
const mapDocumentToApplication = (doc: any): Application => ({
  $id: doc.$id,
  jobId: doc.jobId,
  candidateId: doc.candidateId,
  resumeUrl: doc.resumeUrl || "",
  resumeId: doc.resumeId || "",
  applicationDate: doc.applicationDate || "",
  status: doc.status || "Pending",
});

// Async thunk to fetch all applications for the current user (by candidateId)
export const fetchApplicationsByCandidate = createAsyncThunk<Application[], void>(
  "applications/fetchApplicationsByCandidate",
  async (_, { getState }) => {
    try {
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }
      const response = await databases.listDocuments(db, applications, [
        Query.equal("candidateId", auth.user.$id),
      ]);
      return response.documents.map(mapDocumentToApplication); // Map to Application type
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch applications by candidate");
    }
  }
);

// Async thunk to fetch applications for a specific job (by jobId)
export const fetchApplicationsByJob = createAsyncThunk<Application[], string>(
  "applications/fetchApplicationsByJob",
  async (jobId: string) => {
    try {
      const response = await databases.listDocuments(db, applications, [
        Query.equal("jobId", jobId),
      ]);
      return response.documents.map(mapDocumentToApplication); // Map to Application type
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch applications by job");
    }
  }
);

// Async thunk to add a new application
export const addApplication = createAsyncThunk<Application, Partial<Application> & { resumeFile?: File }>(
  "applications/addApplication",
  async (applicationData, { getState }) => {
    try {
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }
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

      // Prepare application data with URLs and IDs
      const applicationPayload = {
        ...applicationData,
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
      return mapDocumentToApplication(response); // Map to Application type
    } catch (error: any) {
      throw new Error(error.message || "Failed to add application");
    }
  }
);

// Async thunk to update an application
export const updateApplication = createAsyncThunk<Application, { id: string; data: Partial<Application> & { resumeFile?: File } }>(
  "applications/updateApplication",
  async ({ id, data }) => {
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
      return mapDocumentToApplication(response); // Map to Application type
    } catch (error: any) {
      throw new Error(error.message || "Failed to update application");
    }
  }
);

// Async thunk to delete an application
export const deleteApplication = createAsyncThunk<string, string>(
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
    // Fetch applications by candidateId
    builder.addCase(fetchApplicationsByCandidate.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchApplicationsByCandidate.fulfilled, (state, action) => {
      state.loading = false;
      state.applicationsByCandidate = action.payload;
    });
    builder.addCase(fetchApplicationsByCandidate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch applications by candidate";
    });

    // Fetch applications by jobId
    builder.addCase(fetchApplicationsByJob.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchApplicationsByJob.fulfilled, (state, action) => {
      state.loading = false;
      state.applicationsByJob = action.payload;
    });
    builder.addCase(fetchApplicationsByJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch applications by job";
    });

    // Add application
    builder.addCase(addApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.applicationsByCandidate.push(action.payload); // Add the new application to the list
    });
    builder.addCase(addApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add application";
    });

    // Update application
    builder.addCase(updateApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.isupdate = false;
    });
    builder.addCase(updateApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.isupdate = true;
      state.applicationsByCandidate = state.applicationsByCandidate.map((app) =>
        app.$id === action.payload.$id ? action.payload : app
      ); // Replace the updated application in the list
      state.applicationsByJob = state.applicationsByJob.map((app) =>
        app.$id === action.payload.$id ? action.payload : app
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
      state.applicationsByCandidate = state.applicationsByCandidate.filter(
        (app) => app.$id !== action.payload
      ); // Remove the deleted application from the list
      state.applicationsByJob = state.applicationsByJob.filter(
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