// inboxSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/AxiosConfig";
import { Inbox } from "@/types/inboxType";

interface InboxState {
  isLoaded: boolean;
  selected: Inbox | null;
  items: Inbox[];
}

const initialState: InboxState = {
  isLoaded: false,
  selected: null,
  items: []
};

// ✅ Async thunk to fetch inbox items
export const fetchInboxItems = createAsyncThunk(
  "inbox/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/get/inbox");
      return response.data.sort(
        (a: { timestamp: string }, b: { timestamp: string }) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error: unknown) {
      console.error("Failed to fetch inbox items:", error);
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        return rejectWithValue(error.response.data || "Failed to fetch");
      }
      return rejectWithValue("Failed to fetch");
    }
  }
);

export const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    addInboxItem: (state, action: PayloadAction<Inbox>) => {
      state.items.push(action.payload);
    },
    updateInboxItem: (state, action: PayloadAction<Partial<Inbox> & { id: string }>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteInboxItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    selectInboxItem: (state, action: PayloadAction<Inbox | null>) => {
      state.selected = action.payload;
    },
    clearInboxSelection: (state) => {
      state.selected = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInboxItems.pending, (state) => {
        state.isLoaded = false;
      })
      .addCase(fetchInboxItems.fulfilled, (state, action: PayloadAction<Inbox[]>) => {
        state.isLoaded = true;
        state.items = action.payload;
      })
      .addCase(fetchInboxItems.rejected, (state) => {
        state.isLoaded = true; // Still true to unblock UI, you can set an error if needed
      });
  }
});

export const {
  addInboxItem,
  updateInboxItem,
  deleteInboxItem,
  selectInboxItem,
  clearInboxSelection
} = inboxSlice.actions;

export default inboxSlice.reducer;
