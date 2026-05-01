import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TabKey } from '../lib/ui';

export type Notice = { type: 'error' | 'success'; message: string } | null;

interface UiState {
  activeTab: TabKey;
  notice: Notice;
}

const initialState: UiState = {
  activeTab: 'overview',
  notice: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<TabKey>) {
      state.activeTab = action.payload;
    },
    setNotice(state, action: PayloadAction<Notice>) {
      state.notice = action.payload;
    },
    clearNotice(state) {
      state.notice = null;
    },
  },
});

export const { setActiveTab, setNotice, clearNotice } = uiSlice.actions;
export default uiSlice.reducer;
