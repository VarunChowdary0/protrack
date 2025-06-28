import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/AxiosConfig";
import { Project } from "@/types/projectType";

interface AllProjectsState {
  isLoaded: boolean;
  project: Project | null;
}

const initialState: AllProjectsState = {
  isLoaded: false,
  project: null,
};

// ✅ Async thunk with projectId as input
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
      const error = err as { response?: { data?: { error?: string } }, message?: string };
      console.error("Failed to fetch project:", error);
      if (error?.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Failed to fetch project");
    }
  }
);

// ✅ Slice definition
export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<Project | null>) => {
      state.project = action.payload;
    },
    clearProject: (state) => {
      state.project = null;
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      if (state.project && state.project.id === action.payload.id) {
        state.project = { ...state.project, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.isLoaded = false;
      })
      .addCase(fetchProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoaded = true;
        state.project = action.payload;
      })
      .addCase(fetchProject.rejected, (state) => {
        state.isLoaded = false;
        state.project = null;
      });
  },
});

export const { setProject, clearProject, updateProject } = projectSlice.actions;
export default projectSlice.reducer;
