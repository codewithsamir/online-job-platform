import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, storage } from "@/models/client/config"; // Import Appwrite configuration
import { db, companies, ImageBucket } from "@/models/name"; // Import database and collection names
import { Query } from "appwrite";

// Define the company interface
export interface Company {
  $id: string;
  name: string;
  description?: string;
  industry: string;
  website?: string;
  logoUrl?: File | string; // URL of the company logo
  logoId?: string; // ID of the uploaded logo file in the storage bucket
  createdBy: string; // User ID of the creator
  email: string; // Email of the creator
}

// Define the initial state
interface CompanyState {
  companies: Company[]; // Array of company objects
  loading: boolean;
  isadddone:boolean;
  error: string | null;
}

// Initial state with proper structure
const initialState: CompanyState = {
  companies: [],
  isadddone:false,
  loading: false,
  error: null,
};

// Helper function to generate file URLs
const generateFileUrl = (bucketId: string, fileId: string) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

// Async thunk to fetch all companies for the current user
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { getState }) => {
    try {
      // Get the current user from the Redux state
      const { auth }: { auth: { user: { $id: string } } } = getState() as {
        auth: { user: { $id: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }
      // Fetch companies where createdBy matches the current user's ID
      const response = await databases.listDocuments(db, companies, [
        Query.equal("createdBy", auth.user.$id),
      ]);
      return response; // Return the list of companies
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch companies");
    }
  }
);

// Async thunk to add a new company
export const addCompany = createAsyncThunk(
  "companies/addCompany",
  async (companyData: Omit<Company, "$id" | "createdBy" | "email">, { getState }) => {
    try {
      // Get the current user from the Redux state
      const { auth }: { auth: { user: { $id: string; email: string } } } = getState() as {
        auth: { user: { $id: string; email: string } };
      };
      if (!auth.user?.$id) {
        throw new Error("User not authenticated");
      }

      // Add the current user's ID and email to the company data
      companyData.createdBy = auth.user.$id;
      companyData.email = auth.user.email;

      // Upload company logo to the image bucket
      let logoUrl = "";
      let logoId = "";
      if (companyData.logoUrl && typeof companyData.logoUrl !== "string") {
        const logoFile = companyData.logoUrl; // Assuming logoUrl is a File object
        const logoResponse = await storage.createFile(
          ImageBucket,
          "unique()", // Auto-generate file ID
          logoFile
        );
        
        logoId = logoResponse.$id;
        logoUrl = generateFileUrl(ImageBucket, logoId); // Generate URL
      }
      console.log(logoUrl,logoId)
      // Prepare company data with URLs and IDs
      const companyPayload = {
        ...companyData,
        logoUrl,
        logoId,
      };

      // Create the company document in the database
      const response = await databases.createDocument(
        db,
        companies,
        "unique()", // Auto-generate document ID
        companyPayload
      );
      return response as Company; // Return the newly created company
    } catch (error: any) {
      throw new Error(error.message || "Failed to add company");
    }
  }
);

// Async thunk to update a company
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ id, data }: { id: string; data: Partial<Omit<Company, "$id" | "createdBy" | "email">> }) => {
    try {
      // If a new logo is uploaded, update it in the image bucket
      let logoUrl = data.logoUrl;
      let logoId = data.logoId;
      if (data.logoUrl && typeof data.logoUrl !== "string") {
        const logoFile = data.logoUrl; // Assuming logoUrl is a File object
        const logoResponse = await storage.createFile(
          ImageBucket,
          "unique()", // Auto-generate file ID
          logoFile
        );
        logoId = logoResponse.$id;
        logoUrl = generateFileUrl(ImageBucket, logoId); // Generate URL
      }

      // Prepare updated company data with URLs and IDs
      const updatedData = {
        ...data,
        logoUrl,
        logoId,
      };

      // Update the company document in the database
      const response = await databases.updateDocument(db, companies, id, updatedData);
      return response as Company; // Return the updated company
    } catch (error: any) {
      throw new Error(error.message || "Failed to update company");
    }
  }
);

// Async thunk to delete a company
export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (id: string) => {
    try {
      await databases.deleteDocument(db, companies, id);
      return id; // Return the ID of the deleted company
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete company");
    }
  }
);

// Create the slice
const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch companies
    builder.addCase(fetchCompanies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      state.loading = false;
      state.companies = action.payload;
    });
    builder.addCase(fetchCompanies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch companies";
    });

    // Add company
    builder.addCase(addCompany.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.isadddone = true;
      state.companies = action.payload; // Add the new company to the list
    });
    builder.addCase(addCompany.rejected, (state, action) => {
      state.loading = false;
      state.isadddone = false;

      state.error = action.error.message || "Failed to add company";
    });

    // Update company
    builder.addCase(updateCompany.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCompany.fulfilled, (state, action) => {
      state.loading = false;
      const updatedCompany = action.payload;
      state.companies = state.companies.map((company) =>
        company.$id === updatedCompany.$id ? updatedCompany : company
      ); // Replace the updated company in the list
    });
    builder.addCase(updateCompany.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update company";
    });

    // Delete company
    builder.addCase(deleteCompany.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.companies = state.companies.filter(
        (company:any) => company.$id !== action.payload
      ); // Remove the deleted company from the list
    });
    builder.addCase(deleteCompany.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete company";
    });
  },
});

// Export actions and reducer
export default companySlice.reducer;