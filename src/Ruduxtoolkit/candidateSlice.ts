// features/candidate/candidateSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, storage } from "@/models/client/config"; 
import { db, candidates, resumeBucket, ImageBucket } from "@/models/name"; 
import { Query } from "appwrite";

// ----------------- Types -----------------
export interface Candidate {
  $id: string;
  fullName: string;
  address?: string;
  phone?: string;
  dateofbirth?: string;
  education?: string;
  experience?: string;
  gender?: string;
  email: string;
  skills: string;
  userId: string;
  profileUrl?: string;
  profileid?: string;
  resumeUrl?: string;
  resumeid?: string;
  $createdAt?: string;
}

export interface CandidateInput extends Partial<Candidate> {
  image?: File;
  resume?: File;
}

interface CandidateState {
  candidates: Candidate[];
  isLoading: boolean;
  error: string | null;
}

// ----------------- Initial State -----------------
const initialState: CandidateState = {
  candidates: [],
  isLoading: false,
  error: null,
};

// ----------------- Helpers -----------------
const generateFileUrl = (bucketId: string, fileId: string) =>
  `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

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
  skills: doc.skills,
  userId: doc.userId,
  profileUrl: doc.profileUrl || "",
  profileid: doc.profileid || "",
  resumeUrl: doc.resumeUrl || "",
  resumeid: doc.resumeid || "",
  $createdAt: doc.$createdAt || "",
});

// ----------------- Async Thunks -----------------

// Fetch all candidates for current user
export const fetchCandidates = createAsyncThunk<Candidate[], void>(
  "candidates/fetchCandidates",
  async (_, { getState }) => {
    const { auth }: { auth: { user: { $id: string } } } = getState() as any;
    if (!auth.user?.$id) throw new Error("User not authenticated");

    const response = await databases.listDocuments(db, candidates, [
      Query.equal("userId", auth.user.$id),
    ]);
    return response.documents.map(mapDocumentToCandidate);
  }
);

// Fetch candidates by userId
export const fetchCandidatesByUserId = createAsyncThunk<Candidate[], string>(
  "candidates/fetchCandidatesByUserId",
  async (userId: string) => {
    if (!userId) throw new Error("User ID is required");

    const response = await databases.listDocuments(db, candidates, [
      Query.equal("userId", userId),
    ]);
    return response.documents.map(mapDocumentToCandidate);
  }
);

// Add candidate
export const addCandidate = createAsyncThunk<Candidate, CandidateInput>(
  "candidates/addCandidate",
  async (candidateData, { getState }) => {
    const { auth }: { auth: { user: { $id: string; email: string } } } = getState() as any;
    if (!auth.user?.$id) throw new Error("User not authenticated");

    candidateData.userId = auth.user.$id;
    candidateData.email = auth.user.email;

    let profileUrl = "";
    let profileid = "";

    if (candidateData.image) {
      const imageResponse = await storage.createFile(ImageBucket, "unique()", candidateData.image);
      profileid = imageResponse.$id;
      profileUrl = generateFileUrl(ImageBucket, profileid);
    }

    const { image, ...data } = candidateData;
    const candidatePayload = { profileUrl, profileid, ...data };

    const response = await databases.createDocument(db, candidates, "unique()", candidatePayload);
    return mapDocumentToCandidate(response);
  }
);

// Update candidate
export const updateCandidate = createAsyncThunk<Candidate, { id: string; data: CandidateInput }>(
  "candidates/updateCandidate",
  async ({ id, data }) => {
    let profileUrl = data.profileUrl;
    let profileid = data.profileid;

    if (data.image) {
      const imageResponse = await storage.createFile(ImageBucket, "unique()", data.image);
      profileid = imageResponse.$id;
      profileUrl = generateFileUrl(ImageBucket, profileid);
    }

    let resumeUrl = data.resumeUrl;
    let resumeid = data.resumeid;

    if (data.resume) {
      const resumeResponse = await storage.createFile(resumeBucket, "unique()", data.resume);
      resumeid = resumeResponse.$id;
      resumeUrl = generateFileUrl(resumeBucket, resumeid);
    }

    const updatedData = { ...data, profileUrl, profileid, resumeUrl, resumeid };
    const response = await databases.updateDocument(db, candidates, id, updatedData);
    return mapDocumentToCandidate(response);
  }
);

// Delete candidate
export const deleteCandidate = createAsyncThunk<string, string>(
  "candidates/deleteCandidate",
  async (id: string) => {
    await databases.deleteDocument(db, candidates, id);
    return id;
  }
);

// ----------------- Slice -----------------
const candidateSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Loading handler
    const setLoading = (state: CandidateState) => {
      state.isLoading = true;
      state.error = null;
    };
    const unsetLoading = (state: CandidateState) => {
      state.isLoading = false;
    };

    // Fetch candidates
    builder.addCase(fetchCandidates.pending, setLoading);
    builder.addCase(fetchCandidates.fulfilled, (state, action) => {
      unsetLoading(state);
      state.candidates = action.payload;
    });
    builder.addCase(fetchCandidates.rejected, (state, action) => {
      unsetLoading(state);
      state.error = action.error.message || "Failed to fetch candidates";
    });

    // Fetch by userId
    builder.addCase(fetchCandidatesByUserId.pending, setLoading);
    builder.addCase(fetchCandidatesByUserId.fulfilled, (state, action) => {
      unsetLoading(state);
      state.candidates = action.payload;
    });
    builder.addCase(fetchCandidatesByUserId.rejected, (state, action) => {
      unsetLoading(state);
      state.error = action.error.message || "Failed to fetch candidates by user ID";
    });

    // Add candidate
    builder.addCase(addCandidate.pending, setLoading);
    builder.addCase(addCandidate.fulfilled, (state, action) => {
      unsetLoading(state);
      state.candidates.push(action.payload);
    });
    builder.addCase(addCandidate.rejected, (state, action) => {
      unsetLoading(state);
      state.error = action.error.message || "Failed to add candidate";
    });

    // Update candidate
    builder.addCase(updateCandidate.pending, setLoading);
    builder.addCase(updateCandidate.fulfilled, (state, action) => {
      unsetLoading(state);
      state.candidates = state.candidates.map(c =>
        c.$id === action.payload.$id ? action.payload : c
      );
    });
    builder.addCase(updateCandidate.rejected, (state, action) => {
      unsetLoading(state);
      state.error = action.error.message || "Failed to update candidate";
    });

    // Delete candidate
    builder.addCase(deleteCandidate.pending, setLoading);
    builder.addCase(deleteCandidate.fulfilled, (state, action) => {
      unsetLoading(state);
      state.candidates = state.candidates.filter(c => c.$id !== action.payload);
    });
    builder.addCase(deleteCandidate.rejected, (state, action) => {
      unsetLoading(state);
      state.error = action.error.message || "Failed to delete candidate";
    });
  },
});

export default candidateSlice.reducer;
