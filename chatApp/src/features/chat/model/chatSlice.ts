import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '@/entities/message/model/types';
import type { Session } from '@/entities/session/model/types';

export const CHAT_SLICE_NAME = 'chat' as const;

interface ChatState {
  roomId: string | null;
  messages: Message[];
  hostId: string | null;
  text: string;
  error: string | null;
}

const initialState: ChatState = {
  roomId: null,
  messages: [],
  hostId: null,
  text: '',
  error: null,
};

const chatSlice = createSlice({
  name: CHAT_SLICE_NAME,
  initialState,
  reducers: {
    setRoomData(state, action: PayloadAction<{ messages: Message[]; session: Session }>) {
      state.messages = action.payload.messages;
      state.hostId = action.payload.session.host_id ?? null;
      state.error = null;
    },
    addMessage(state, action: PayloadAction<Message>) {
      if (!state.messages.some((m) => m.id === action.payload.id)) {
        state.messages.push(action.payload);
      }
    },
    setText(state, action: PayloadAction<string>) {
      state.text = action.payload;
    },
    setRoomId(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
      state.error = null;
    },
    setChatError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    resetChat() {
      return initialState;
    },
  },
});

export const { setRoomData, addMessage, setText, setRoomId, setChatError, resetChat } =
  chatSlice.actions;
export default chatSlice.reducer;

export const selectMessages = (state: { chat: ChatState }) => state.chat.messages;
export const selectHostId = (state: { chat: ChatState }) => state.chat.hostId;
export const selectText = (state: { chat: ChatState }) => state.chat.text;
export const selectRoomId = (state: { chat: ChatState }) => state.chat.roomId;
export const selectChatError = (state: { chat: ChatState }) => state.chat.error;
