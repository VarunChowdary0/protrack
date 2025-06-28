import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/AxiosConfig";
import { Project } from "@/types/projectType";

interface AllProjectsState {
  isLoaded: boolean;
  items: Partial<Project>[];
  selected: Project | null;
}

const initialState: AllProjectsState = {
  isLoaded: false,
  items: [],
  selected: null,
};

// Async thunk to fetch all user-related projects
export const fetchAllProjects = createAsyncThunk(
  "allProjects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/project/get-my");
      return response.data.sort(
        (a: Project, b: Project) =>
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime()
      );
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }, message?: string };
      console.error("Failed to fetch projects:", error);
      if (error?.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Failed to fetch projects");
    }
  }
);

// Slice definition
export const allProjectsSlice = createSlice({
  name: "allProjects",
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.items.push(action.payload);
    },
    updateProject: (
      state,
      action: PayloadAction<Partial<Project> & { id: string }>
    ) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    selectProject: (state, action: PayloadAction<Project | null>) => {
      state.selected = action.payload;
    },
    clearProjectSelection: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProjects.pending, (state) => {
      state.isLoaded = false;
    });
    builder.addCase(
      fetchAllProjects.fulfilled,
      (state, action: PayloadAction<Project[]>) => {
        state.isLoaded = true;
        state.items = action.payload;
      }
    );
    builder.addCase(fetchAllProjects.rejected, (state) => {
      state.isLoaded = false;
    });
  },
});

// Export actions
export const {
  addProject,
  updateProject,
  deleteProject,
  selectProject,
  clearProjectSelection,
} = allProjectsSlice.actions;

// Export reducer
export default allProjectsSlice.reducer;
