// booleanSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BooleanState {
    isChatOpen: boolean;
    hideBottomBar: boolean; 
    isDarkMode: boolean;
}

const initialState: BooleanState = {
  isChatOpen: false,
  hideBottomBar: false,
  isDarkMode: true, // Default value for dark mode
};

const booleanSlice = createSlice({
  name: 'boolean',
  initialState,
  reducers: {
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.isChatOpen = action.payload;
    },
    setHideBottomBar(state, action: PayloadAction<boolean>) {
      state.hideBottomBar = action.payload;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      console.log("Dark mode set to:", action.payload);
      state.isDarkMode = action.payload;
    }
  },
});

export const { 
  setChatOpen,
  setHideBottomBar, 
  setDarkMode 
} = booleanSlice.actions;

export default booleanSlice.reducer;
