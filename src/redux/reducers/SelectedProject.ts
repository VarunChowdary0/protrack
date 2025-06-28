import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/AxiosConfig";
import { Project } from "@/types/projectType";

interface AllProjectsState {
  isLoaded: boolean;
  project: Project | null;
  error: string | null;
  shouldLogout: boolean;
}

const initialState: AllProjectsState = {
  isLoaded: false,
  project: null,
  error: null,
  shouldLogout: false,
};

// ✅ Async thunk with projectId as input and improved error handling
export const fetchProject = createAsyncThunk(
  "project/fetch",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/project/get", {
        params: { projectId },
      });
      console.log(response.data);
      return response.data as Project;
    } catch (err: unknown) {
      const error = err as { 
        response?: { 
          data?: { error?: string; action?: string },
          status?: number 
        }, 
        message?: string 
      };
      console.error("Failed to fetch project:", error);
      
      if (error?.response?.data) {
        return rejectWithValue({
          error: error.response.data.error || "Unknown error occurred",
          status: error.response.status,
          action: error.response.data.action
        });
      }
      return rejectWithValue({
        error: error.message || "Failed to fetch project",
        status: null,
        action: null
      });
    }
  }
);

// ✅ Slice definition with 403 handling
export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<Project | null>) => {
      state.project = action.payload;
    },
    clearProject: (state) => {
      state.project = null;
      state.error = null;
      state.shouldLogout = false;
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      if (state.project && state.project.id === action.payload.id) {
        state.project = { ...state.project, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
      state.shouldLogout = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.isLoaded = false;
        state.error = null;
        state.shouldLogout = false;
      })
      .addCase(fetchProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoaded = true;
        state.project = action.payload;
        state.error = null;
        state.shouldLogout = false;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        const payload = action.payload as {
          error: string;
          status?: number;
          action?: string;
        };
        
        state.error = payload?.error || "Failed to fetch project";
        state.project = null;
        
        // Handle 403 specifically - user tried to access but not authorized
        if (payload?.status === 403 || payload?.status === 404) {
          state.isLoaded = true; // ✅ Set to true for 403 as requested
        } else {
          state.isLoaded = false; // For other errors, keep as false
        }
        
        // Handle logout action for 401/404 with user not found
        state.shouldLogout = payload?.action === "LOGOUT";
      });
  },
});

export const { setProject, clearProject, updateProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;