import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from '@/entities/session/model/sessionSlice';
import chatReducer from '@/features/chat/model/chatSlice';
import { socketMiddleware } from './socketMiddleware';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
