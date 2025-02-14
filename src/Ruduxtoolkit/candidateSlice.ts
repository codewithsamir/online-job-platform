import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, storage } from "@/models/client/config"; // Import Appwrite configuration
import { db, candidates, resumeBucket, ImageBucket } from "@/models/name"; // Import database and collection names
import { Query } from "appwrite";


// Define the candidate interface
interface Candidate {
  total: number; // Total number of candidates
  documents: any[]; // Array of candidate objects
}

// Define the initial state
interface CandidateState {
  candidates: Candidate; // Single candidate object
  loading: boolean;
  error: string | null;
}

// Initial state with proper structure
const initialState: CandidateState = {
  candidates: {
    total: 0, // Initialize total to 0
    documents: [], // Initialize documents as an empty array
  },
  loading: false,
  error: null,
};

// Helper function to generate file URLs
const generateFileUrl = (bucketId: string, fileId: string) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

// Async thunk to fetch all candidates for the current user
export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async (_, { getState }) => {
    try {
      // Get the current user from the Redux state
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };

      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }

      // Fetch candidates where userId matches the current user's ID
      const response = await databases.listDocuments(db, candidates, [
        Query.equal("userId", auth.user.$id),
      ]);

      return response; // Return the list of candidates
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch candidates");
    }
  }
);

// Async thunk to add a new candidate
export const addCandidate = createAsyncThunk(
  "candidates/addCandidate",
  async (candidateData: any, { getState }) => {
    try {
      // Get the current user from the Redux state
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };

      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }

      // Add the current user's ID to the candidate data
      candidateData.userId = auth.user.$id;

      // Upload profile picture to the image bucket
      let profilePictureUrl = "";
      let profilePictureid = "";
      if (candidateData.image) {
        const imageFile = candidateData.image;
        const imageResponse = await storage.createFile(
          ImageBucket,
          "unique()", // Auto-generate file ID
          imageFile
        );
        profilePictureid = imageResponse.$id;
        profilePictureUrl = generateFileUrl(ImageBucket, profilePictureid); // Generate URL
      }

      // Upload resume to the resume bucket
      let resumeUrl = "";
      let resumeid = "";
      if (candidateData.resume) {
        const resumeFile = candidateData.resume;
        const resumeResponse = await storage.createFile(
          resumeBucket,
          "unique()", // Auto-generate file ID
          resumeFile
        );
        resumeid = resumeResponse.$id;
        resumeUrl = generateFileUrl(resumeBucket, resumeid); // Generate URL
      }

      // Prepare candidate data with URLs and IDs
      const candidatePayload = {
        ...candidateData,
        profilePictureUrl,
        profilePictureid,
        resumeUrl,
        resumeid,
      };

      // Create the candidate document in the database
      const response = await databases.createDocument(
        db,
        candidates,
        "unique()", // Auto-generate document ID
        candidatePayload
      );

      return response; // Return the newly created candidate
    } catch (error: any) {
      throw new Error(error.message || "Failed to add candidate");
    }
  }
);

// Async thunk to update a candidate
export const updateCandidate = createAsyncThunk(
  "candidates/updateCandidate",
  async ({ id, data }: { id: string; data: any }) => {
    try {
      // If a new profile picture is uploaded, update it in the image bucket
      let profilePictureUrl = data.profilePictureUrl;
      let profilePictureid = data.profilePictureid;
      if (data.image) {
        const imageFile = data.image;
        const imageResponse = await storage.createFile(
          ImageBucket,
          "unique()", // Auto-generate file ID
          imageFile
        );
        profilePictureid = imageResponse.$id;
        profilePictureUrl = generateFileUrl(ImageBucket, profilePictureid); // Generate URL
      }

      // If a new resume is uploaded, update it in the resume bucket
      let resumeUrl = data.resumeUrl;
      let resumeid = data.resumeid;
      if (data.resume) {
        const resumeFile = data.resume;
        const resumeResponse = await storage.createFile(
          resumeBucket,
          "unique()", // Auto-generate file ID
          resumeFile
        );
        resumeid = resumeResponse.$id;
        resumeUrl = generateFileUrl(resumeBucket, resumeid); // Generate URL
      }

      // Prepare updated candidate data with URLs and IDs
      const updatedData = {
        ...data,
        profilePictureUrl,
        profilePictureid,
        resumeUrl,
        resumeid,
      };

      // Update the candidate document in the database
      const response = await databases.updateDocument(db, candidates, id, updatedData);

      return response; // Return the updated candidate
    } catch (error: any) {
      throw new Error(error.message || "Failed to update candidate");
    }
  }
);

// Async thunk to delete a candidate
export const deleteCandidate = createAsyncThunk(
  "candidates/deleteCandidate",
  async (id: string) => {
    try {
      await databases.deleteDocument(db, candidates, id);
      return id; // Return the ID of the deleted candidate
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete candidate");
    }
  }
);

// Create the slice
const candidateSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch candidates
    builder.addCase(fetchCandidates.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCandidates.fulfilled, (state, action) => {
      state.loading = false;
      state.candidates = action.payload;
    });
    builder.addCase(fetchCandidates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch candidates";
    });

    // Add candidate
    builder.addCase(addCandidate.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCandidate.fulfilled, (state, action) => {
      state.loading = false;
      state.candidates.push(action.payload); // Add the new candidate to the list
    });
    builder.addCase(addCandidate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add candidate";
    });

    // Update candidate
    builder.addCase(updateCandidate.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCandidate.fulfilled, (state, action) => {
      state.loading = false;
      const updatedCandidate = action.payload;
      state.candidates = state.candidates.map((candidate) =>
        candidate.$id === updatedCandidate.$id ? updatedCandidate : candidate
      ); // Replace the updated candidate in the list
    });
    builder.addCase(updateCandidate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update candidate";
    });

    // Delete candidate
    builder.addCase(deleteCandidate.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCandidate.fulfilled, (state, action) => {
      state.loading = false;
      state.candidates = state.candidates.filter(
        (candidate) => candidate.$id !== action.payload
      ); // Remove the deleted candidate from the list
    });
    builder.addCase(deleteCandidate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete candidate";
    });
  },
});

// Export actions and reducer
export default candidateSlice.reducer;