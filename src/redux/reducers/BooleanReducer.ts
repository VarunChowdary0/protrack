// booleanSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BooleanState {
    isChatOpen: boolean;
    hideBottomBar: boolean; 
}

const initialState: BooleanState = {
  isChatOpen: false,
  hideBottomBar: false,
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
  },
});

export const { setChatOpen, setHideBottomBar } = booleanSlice.actions;
export default booleanSlice.reducer;
