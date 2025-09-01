// features/company/companySlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, storage } from "@/models/client/config"; 
import { db, companies, ImageBucket } from "@/models/name"; 
import { Query } from "appwrite";

// ----------------- Types -----------------
export interface Company {
  $id: string;
  name: string;
  description?: string;
  industry: string;
  website?: string;
  logoUrl?: string; 
  logoId?: string; 
  createdBy: string;
  email: string;
  $createdAt: string;
}

interface CompanyState {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  isAddDone: boolean;
}

// ----------------- Initial State -----------------
const initialState: CompanyState = {
  companies: [],
  isLoading: false,
  error: null,
  isAddDone: false,
};

// ----------------- Helpers -----------------
const generateFileUrl = (bucketId: string, fileId: string) =>
  `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

const mapDocumentToCompany = (doc: any): Company => ({
  $id: doc.$id,
  name: doc.name,
  industry: doc.industry,
  createdBy: doc.createdBy,
  email: doc.email,
  description: doc.description || "",
  website: doc.website || "",
  logoUrl: doc.logoUrl || "",
  logoId: doc.logoId || "",
  $createdAt: doc.$createdAt,
});

// ----------------- Async Thunks -----------------

// Fetch companies of current user
export const fetchCompanies = createAsyncThunk<Company[], void>(
  "companies/fetchCompanies",
  async (_, { getState }) => {
    const { auth }: { auth: { user: { $id: string } } } = getState() as any;
    if (!auth.user?.$id) throw new Error("User not authenticated");

    const response = await databases.listDocuments(db, companies, [
      Query.equal("createdBy", auth.user.$id),
    ]);
    return response.documents.map(mapDocumentToCompany);
  }
);

// Add new company
export const addCompany = createAsyncThunk<Company, Omit<Company, "$id">>(
  "companies/addCompany",
  async (companyData, { getState }) => {
    const { auth }: { auth: { user: { $id: string; email: string } } } = getState() as any;
    if (!auth.user?.$id) throw new Error("User not authenticated");

    companyData.createdBy = auth.user.$id;
    companyData.email = auth.user.email;

    let logoUrl = "";
    let logoId = "";

    // Upload logo if it’s a File object
    if (companyData.logoUrl && typeof companyData.logoUrl !== "string") {
      const logoFile = companyData.logoUrl as unknown as File;
      const logoResponse = await storage.createFile(ImageBucket, "unique()", logoFile);
      logoId = logoResponse.$id;
      logoUrl = generateFileUrl(ImageBucket, logoId);
    }

    const { logoUrl: _ignored, ...data } = companyData;
    const payload = { ...data, logoUrl, logoId };
    const response = await databases.createDocument(db, companies, "unique()", payload);

    return mapDocumentToCompany(response);
  }
);

// ----------------- Slice -----------------
const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setLoading = (state: CompanyState) => {
      state.isLoading = true;
      state.error = null;
    };
    const unsetLoading = (state: CompanyState) => {
      state.isLoading = false;
    };

    // Fetch companies
    builder.addCase(fetchCompanies.pending, setLoading);
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      unsetLoading(state);
      state.companies = action.payload;
      state.isAddDone = true;
    });
    builder.addCase(fetchCompanies.rejected, (state, action) => {
      unsetLoading(state);
      state.error = action.error.message || "Failed to fetch companies";
      state.isAddDone = false;
    });

    // Add company
    builder.addCase(addCompany.pending, setLoading);
    builder.addCase(addCompany.fulfilled, (state, action) => {
      unsetLoading(state);
      state.companies.push(action.payload);
    });
    builder.addCase(addCompany.rejected, (state, action) => {
      unsetLoading(state);
      state.error = action.error.message || "Failed to add company";
    });
  },
});

export default companySlice.reducer;
