import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, storage } from "@/models/client/config";
import { db, applications, ImageBucket } from "@/models/name";
import { Query } from "appwrite";

export interface Application {
  $id: string;
  jobId: string;
  candidateId: string;
  resumeUrl?: string;
  resumeId?: string;
  applicationDate: string;
  status: string;
}

interface ApplicationState {
  applicationsByCandidate: Application[];
  applicationsByJob: Application[];
  loading: boolean;
  isUpdate: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  applicationsByCandidate: [],
  applicationsByJob: [],
  loading: false,
  isUpdate: false,
  error: null,
};

// Helpers
const generateFileUrl = (bucketId: string, fileId: string) =>
  `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const mapDocumentToApplication = (doc: any): Application => ({
  $id: doc.$id,
  jobId: doc.jobId,
  candidateId: doc.candidateId,
  resumeUrl: doc.resumeUrl || "",
  resumeId: doc.resumeId || "",
  applicationDate: doc.applicationDate || "",
  status: doc.status || "Pending",
});

// ----------------- Thunks -----------------

export const fetchApplicationsByCandidate = createAsyncThunk<Application[], void>(
  "applications/fetchByCandidate",
  async (_, { getState }) => {
    const { auth }: any = getState();
    if (!auth.user?.$id) throw new Error("User not authenticated");

    const response = await databases.listDocuments(db, applications, [
      Query.equal("candidateId", auth.user.$id),
    ]);

    return response.documents.map(mapDocumentToApplication);
  }
);

export const fetchApplicationsByJob = createAsyncThunk<Application[], string>(
  "applications/fetchByJob",
  async (jobId) => {
    const response = await databases.listDocuments(db, applications, [
      Query.equal("jobId", jobId),
    ]);
    return response.documents.map(mapDocumentToApplication);
  }
);

export const addApplication = createAsyncThunk<Application, Partial<Application> & { resumeFile?: File }>(
  "applications/add",
  async (data, { getState }) => {
    const { auth }: any = getState();
    if (!auth.user?.$id) throw new Error("User not authenticated");

    let resumeUrl = "";
    let resumeId = "";

    if (data.resumeFile) {
      const response = await storage.createFile(ImageBucket, "unique()", data.resumeFile);
      resumeId = response.$id;
      resumeUrl = generateFileUrl(ImageBucket, resumeId);
    }
const {applicationDate,candidateId,jobId}  =data;
    const payload = {
    applicationDate,
    candidateId,
    jobId,

      resumeUrl,
      resumeId,
      status: "Pending",
    };

    const response = await databases.createDocument(db, applications, "unique()", payload);
    return mapDocumentToApplication(response);
  }
);

export const updateApplication = createAsyncThunk<Application, { id: string; data: Partial<Application> & { resumeFile?: File } }>(
  "applications/update",
  async ({ id, data }) => {
    let resumeUrl = data.resumeUrl;
    let resumeId = data.resumeId;

    if (data.resumeFile) {
      const response = await storage.createFile(ImageBucket, "unique()", data.resumeFile);
      resumeId = response.$id;
      resumeUrl = generateFileUrl(ImageBucket, resumeId);
    }

    const updatedData = { ...data, resumeUrl, resumeId };
    const response = await databases.updateDocument(db, applications, id, updatedData);

    return mapDocumentToApplication(response);
  }
);

export const deleteApplication = createAsyncThunk<string, string>(
  "applications/delete",
  async (id) => {
    await databases.deleteDocument(db, applications, id);
    return id;
  }
);

// ----------------- Slice -----------------

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setPending = (state: ApplicationState) => { state.loading = true; state.error = null; state.isUpdate = false; };
    const setRejected = (state: ApplicationState, error: any) => { state.loading = false; state.error = error.message || "Operation failed"; };

    builder.addCase(fetchApplicationsByCandidate.pending, setPending);
    builder.addCase(fetchApplicationsByCandidate.fulfilled, (state, action) => {
      state.loading = false;
      state.applicationsByCandidate = action.payload;
    });
    builder.addCase(fetchApplicationsByCandidate.rejected, (state, action) => setRejected(state, action.error));

    builder.addCase(fetchApplicationsByJob.pending, setPending);
    builder.addCase(fetchApplicationsByJob.fulfilled, (state, action) => {
      state.loading = false;
      state.applicationsByJob = action.payload;
    });
    builder.addCase(fetchApplicationsByJob.rejected, (state, action) => setRejected(state, action.error));

    builder.addCase(addApplication.pending, setPending);
    builder.addCase(addApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.applicationsByCandidate.push(action.payload);
    });
    builder.addCase(addApplication.rejected, (state, action) => setRejected(state, action.error));

    builder.addCase(updateApplication.pending, setPending);
    builder.addCase(updateApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdate = true;
      state.applicationsByCandidate = state.applicationsByCandidate.map(app => app.$id === action.payload.$id ? action.payload : app);
      state.applicationsByJob = state.applicationsByJob.map(app => app.$id === action.payload.$id ? action.payload : app);
    });
    builder.addCase(updateApplication.rejected, (state, action) => setRejected(state, action.error));

    builder.addCase(deleteApplication.pending, setPending);
    builder.addCase(deleteApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.applicationsByCandidate = state.applicationsByCandidate.filter(app => app.$id !== action.payload);
      state.applicationsByJob = state.applicationsByJob.filter(app => app.$id !== action.payload);
    });
    builder.addCase(deleteApplication.rejected, (state, action) => setRejected(state, action.error));
  },
});

export default applicationSlice.reducer;
