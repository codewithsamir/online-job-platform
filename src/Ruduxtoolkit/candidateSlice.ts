import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, storage } from "@/models/client/config"; // Import Appwrite configuration
import { db, candidates, resumeBucket, ImageBucket } from "@/models/name"; // Import database and collection names
import { Query } from "appwrite";

// Define the Candidate interface
export interface Candidate {
  $id: string; // Unique ID of the candidate
  fullName: string;
  address?: string;
  phone?: string;
  dateofbirth?: string;
  education?: string;
  experience?: string;
  gender?: string;
  email: string;
  skills:string;
  userId: string; // User ID of the creator
  profileUrl?: string; // URL of the profile picture
  profileid?: string; // ID of the uploaded profile picture file
  resumeUrl?: string; // URL of the resume
  resumeid?: string; // ID of the uploaded resume file
  $createdAt?: string; // Creation timestamp
}

// Define an extended type for candidate input data (includes temporary file properties)
export interface CandidateInput extends Partial<Candidate> {
  image?: File; // Temporary property for profile picture upload
  resume?: File; // Temporary property for resume upload
}

// Define the initial state
interface CandidateState {
  candidates: Candidate[]; // Array of candidate objects
  loading: boolean;
  error: string | null;
}

// Initial state with proper structure
const initialState: CandidateState = {
  candidates: [],
  loading: false,
  error: null,
};

// Helper function to generate file URLs
const generateFileUrl = (bucketId: string, fileId: string): string => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

// Helper function to map Document to Candidate
const mapDocumentToCandidate = (doc: any): Candidate => ({
  $id: doc.$id,
  fullName: doc.fullName,
  address: doc.address || "",
  phone: doc.phone || "",
  dateofbirth: doc.dateofbirth || "",
  education: doc.education || "",
  experience: doc.experience || "",
  gender: doc.gender || "",
  email: doc.email,
  userId: doc.userId,
  skills:doc.skills,
  profileUrl: doc.profileUrl || "",
  profileid: doc.profileid || "",
  resumeUrl: doc.resumeUrl || "",
  resumeid: doc.resumeid || "",
  $createdAt: doc.$createdAt || "",
});

// Async thunk to fetch all candidates for the current user
export const fetchCandidates = createAsyncThunk<Candidate[], void>(
  "candidates/fetchCandidates",
  async (_, { getState }) => {
    try {
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }
      const response = await databases.listDocuments(db, candidates, [
        Query.equal("userId", auth.user.$id),
      ]);
      return response.documents.map(mapDocumentToCandidate); // Map to Candidate type
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch candidates");
    }
  }
);

// Async thunk to fetch candidates by a specific userId
export const fetchCandidatesByUserId = createAsyncThunk<Candidate[], string>(
  "candidates/fetchCandidatesByUserId",
  async (userId: string) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const response = await databases.listDocuments(db, candidates, [
        Query.equal("userId", userId),
      ]);
      return response.documents.map(mapDocumentToCandidate); // Map to Candidate type
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch candidates by user ID");
    }
  }
);

// Async thunk to add a new candidate
export const addCandidate = createAsyncThunk<Candidate, CandidateInput>(
  "candidates/addCandidate",
  async (candidateData: CandidateInput, { getState }) => {
    try {
      const { auth }: { auth: { user: { $id: string; email: string } } } =
        getState() as {
          auth: { user: { $id: string; email: string } };
        };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }
      candidateData.userId = auth.user.$id;
      candidateData.email = auth.user.email;

      // Upload profile picture to the image bucket
      let profileUrl = "";
      let profileid = "";
      if (candidateData.image) {
        const imageFile = candidateData.image;
        const imageResponse = await storage.createFile(
          ImageBucket,
          "unique()", // Auto-generate file ID
          imageFile
        );
        profileid = imageResponse.$id;
        profileUrl = generateFileUrl(ImageBucket, profileid); // Generate URL
      }

      // Prepare candidate data with URLs and IDs
      const candidatePayload = {
        ...candidateData,
        profileUrl,
        profileid,
      };

      // Create the candidate document in the database
      const response = await databases.createDocument(
        db,
        candidates,
        "unique()", // Auto-generate document ID
        candidatePayload
      );
      return response as unknown as Candidate; // Explicitly cast to Candidate
    } catch (error: any) {
      throw new Error(error.message || "Failed to add candidate");
    }
  }
);

// Async thunk to update a candidate
export const updateCandidate = createAsyncThunk<Candidate, { id: string; data: CandidateInput }>(
  "candidates/updateCandidate",
  async ({ id, data }) => {
    try {
      // If a new profile picture is uploaded, update it in the image bucket
      let profilePictureUrl = data.profileUrl;
      let profilePictureid = data.profileid;
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
      const response = await databases.updateDocument(
        db,
        candidates,
        id,
        updatedData
      );
      return response as unknown as Candidate; // Explicitly cast to Candidate
    } catch (error: any) {
      throw new Error(error.message || "Failed to update candidate");
    }
  }
);

// Async thunk to delete a candidate
export const deleteCandidate = createAsyncThunk<string, string>(
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

    // Fetch candidates by userId
    builder.addCase(fetchCandidatesByUserId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCandidatesByUserId.fulfilled, (state, action) => {
      state.loading = false;
      state.candidates = action.payload;
    });
    builder.addCase(fetchCandidatesByUserId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch candidates by user ID";
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