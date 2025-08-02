import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/AxiosConfig";
import { Task } from "@/types/taskTypes";

interface AllTasksState {
  isLoaded: boolean;
  tasks: Task[];
  error: string | null;
  shouldLogout: boolean;
}

const initialState: AllTasksState = {
  isLoaded: false,
  tasks: [],
  error: null,
  shouldLogout: false,
};

// ✅ Fetch tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (
    data: { org_id?: string; participantId: string; projectId: string },
    { rejectWithValue }
  ) => {
    try {
      const path = data.org_id ? "by-org" : "by-user";
      const response = await axiosInstance.get("/api/get/tasks/" + path, {
        params: {
          projectId: data.projectId,
          org_id: data.org_id,
          participantId: data.participantId,
        },
      });
      return response.data.sort(
        (a: Task, b: Task) =>
          new Date(b.dueDate || b.createdAt).getTime() -
          new Date(a.dueDate || a.createdAt).getTime()
      );
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } }, message?: string };
        return rejectWithValue(error.response?.data || "Failed to fetch tasks");
    }
  }
);

// ✅ Update task on backend
export const updateTaskAsync = createAsyncThunk(
  "tasks/update",
  async (task: Task, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/api/manage/tasks/update", task);
      return response.data as Task;
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } }, message?: string };
        return rejectWithValue(error.response?.data || "Failed to update task");
    }
  }
);

// ✅ Delete task on backend
export const deleteTaskAsync = createAsyncThunk(
  "tasks/delete",
  async (taskId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/api/manage/tasks/delete", {
        data: { id: taskId },
      });
      return taskId;
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } }, message?: string };
        return rejectWithValue(error.response?.data || "Failed to delete task");
    }
  }
);

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.isLoaded = true;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
      state.shouldLogout = false;
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks = [...state.tasks, action.payload];
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
      state.shouldLogout = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.isLoaded = false;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoaded = true;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.isLoaded = true;
        state.error = "Failed to load tasks";
      })

      // Update
      .addCase(updateTaskAsync.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...action.payload };
        }
      })
      .addCase(updateTaskAsync.rejected, (state) => {
        state.error = "Failed to update task";
      })

      // Delete
      .addCase(deleteTaskAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state) => {
        state.error = "Failed to delete task";
      });
  },
});

export const {
  setTasks,
  updateTask,
  clearTasks,
  clearError,
  addTask,
  deleteTask,
} = taskSlice.actions;

export default taskSlice.reducer;
