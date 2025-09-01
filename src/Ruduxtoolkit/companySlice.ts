import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases } from "@/models/client/config";
import { db, companies } from "@/models/name";
import { Query } from "appwrite";

// Interface
export interface Company {
  $id: string;
  name: string;
  description?: string;
  industry: string;
  website?: string;
  logoUrl?: string;
  logoId?: string;
  email: string;
  createdBy: string;
  $createdAt: string;
}

// State
interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: string | null;
  isAddDone: boolean;
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
  isAddDone: false,
};

// ✅ Fetch all companies
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(db, companies, [
        Query.orderDesc("$createdAt"),
      ]);
      return response.documents as Company[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch companies");
    }
  }
);

// ✅ Add new company
export const addCompany = createAsyncThunk(
  "companies/addCompany",
  async (newCompany: Omit<Company, "$id" | "$createdAt">, { rejectWithValue }) => {
    try {
      const response = await databases.createDocument(db, companies, "unique()", newCompany);
      return response as Company;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add company");
    }
  }
);

// ✅ Delete company
export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (id: string, { rejectWithValue }) => {
    try {
      await databases.deleteDocument(db, companies, id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete company");
    }
  }
);

// ✅ Update company
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async (
    { id, data }: { id: string; data: Partial<Company> },
    { rejectWithValue }
  ) => {
    try {
      const response = await databases.updateDocument(db, companies, id, data);
      return response as Company;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update company");
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    resetAddDone: (state) => {
      state.isAddDone = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add
      .addCase(addCompany.fulfilled, (state, action) => {
        state.companies.unshift(action.payload);
        state.isAddDone = true;
      })

      // Delete
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter((c) => c.$id !== action.payload);
      })

      // Update
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.companies = state.companies.map((c) =>
          c.$id === action.payload.$id ? action.payload : c
        );
      });
  },
});

export const { resetAddDone } = companySlice.actions;
export default companySlice.reducer;
