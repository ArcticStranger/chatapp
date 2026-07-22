import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Session } from './types';

export const SESSION_SLICE_NAME = 'session' as const;

interface SessionState {
  list: Session[];
  error: string | null;
}

const initialState: SessionState = {
  list: [],
  error: null,
};

const sessionSlice = createSlice({
  name: SESSION_SLICE_NAME,
  initialState,
  reducers: {
    setSessions(state, action: PayloadAction<Session[]>) {
      state.list = action.payload;
      state.error = null;
    },
    setSessionsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setSessions, setSessionsError } = sessionSlice.actions;
export default sessionSlice.reducer;

export const selectSessions = (state: { session: SessionState }) => state.session.list;
export const selectSessionsError = (state: { session: SessionState }) => state.session.error;
