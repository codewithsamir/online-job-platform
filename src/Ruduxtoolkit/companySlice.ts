import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, storage } from "@/models/client/config"; // Import Appwrite configuration
import { db, companies, ImageBucket } from "@/models/name"; // Import database and collection names
import { Query } from "appwrite";

// Define the company interface
export interface Document {
  $id: string;
  name: string;
  description?: string;
  industry: string;
  website?: string;
  logoUrl?:  string ; // URL of the company logo
  logoId?: string; // ID of the uploaded logo file in the storage bucket
  createdBy: string; // User ID of the creator
  email: string; // Email of the creator
}
// Define the company interface
export interface Company {
  $id: string;
  name: string;
  description?: string;
  industry: string;
  website?: string;
  logoUrl?:  string ; // URL of the company logo
  logoId?: string; // ID of the uploaded logo file in the storage bucket
  createdBy: string; // User ID of the creator
  email: string; // Email of the creator
  $createdAt:string
}

// Define the initial state
interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: string | null;
  isadddone:boolean;
}

// Initial state with proper structure
const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
  isadddone:false,
};

// Helper function to generate file URLs
const generateFileUrl = (bucketId: string, fileId: string) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

// Helper function to map Document to Company
const mapDocumentToCompany = (doc: any): Company => ({
  $id: doc.$id,
  name: doc.name,
  industry: doc.industry,
  createdBy: doc.createdBy,
  email: doc.email,
  description: doc.description || "",
  website: doc.website || "",
  logoUrl: doc.logoUrl || "" ,
  logoId: doc.logoId || "",
  $createdAt:doc.$createdAt
});

// Async thunk to fetch all companies for the current user
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { getState }): Promise<Company[]> => {
    try {
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }
      const response = await databases.listDocuments(db, companies, [
        Query.equal("createdBy", auth.user.$id),
      ]);
      return response.documents.map(mapDocumentToCompany); // Map to Company type
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch companies");
    }
  }
);

// Async thunk to add a new company
export const addCompany = createAsyncThunk(
  "companies/addCompany",
  async (companyData: Omit<Company, "$id">, { getState }) => {
    try {
      const { auth }: { auth: { user: { $id: string; email: string } } } = getState() as {
        auth: { user: { $id: string; email: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }
      companyData.createdBy = auth.user.$id;
      companyData.email = auth.user.email;

      let logoUrls = "";
      let logoId = "";
      if (companyData.logoUrl && typeof companyData.logoUrl !== "string") {
        const logoFile = companyData.logoUrl;
        const logoResponse = await storage.createFile(
          ImageBucket,
          "unique()",
          logoFile
        );
        logoId = logoResponse.$id;
        logoUrls = generateFileUrl(ImageBucket, logoId);
      }
      const {logoUrl , ...data} = companyData;
      const companyPayload = {
        ...data,
        logoUrl:logoUrls,
        logoId,
      };

      const response = await databases.createDocument(
        db,
        companies,
        "unique()",
        companyPayload
      );
      return response as unknown as Company; // Explicitly cast to Company
    } catch (error: any) {
      throw new Error(error.message || "Failed to add company");
    }
  }
);

// Create the slice
const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCompanies.pending, (state) => {
      state.loading = true;
      state.error = null;
      
    });
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      state.loading = false;
      state.isadddone=true;
      state.companies = action.payload;
    });
    builder.addCase(fetchCompanies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch companies";
      state.isadddone =false;
    });

    builder.addCase(addCompany.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.companies.push(action.payload);
    });
    builder.addCase(addCompany.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add company";
    });
  },
});

export default companySlice.reducer;