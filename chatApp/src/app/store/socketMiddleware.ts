import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { socket } from '@/shared/api/socket';
import { setSessions, setSessionsError } from '@/entities/session/model/sessionSlice';
import { setRoomData, addMessage, setChatError } from '@/features/chat/model/chatSlice';

export const socketMiddleware: Middleware = (api: MiddlewareAPI) => {
  socket.connect();

  socket.on('sessions-list', (data: unknown) => {
    if (Array.isArray(data)) {
      api.dispatch(setSessions(data));
    } else if (data && typeof data === 'object' && 'error' in data) {
      api.dispatch(setSessionsError((data as { error: string }).error));
    }
  });

  socket.on('receive-message', (message: unknown) => {
    api.dispatch(addMessage(message as Parameters<typeof addMessage>[0]));
  });

  socket.on('room-joined', (data: unknown) => {
    if (data && typeof data === 'object' && 'error' in data) {
      api.dispatch(setChatError((data as { error: string }).error));
      return;
    }
    const d = data as { messages?: unknown[]; session?: unknown };
    if (d.messages && d.session) {
      api.dispatch(
        setRoomData({
          messages: d.messages as Parameters<typeof addMessage>[0][],
          session: d.session as Parameters<typeof setRoomData>[0]['session'],
        }),
      );
    }
  });

  return (next) => (action: unknown) => {
    const a = action as { type: string; payload?: unknown };
    if (a.type === 'chat/joinRoom') {
      socket.emit('join-room', a.payload as string);
    }
    if (a.type === 'chat/sendMessage') {
      socket.emit('send-message', a.payload);
    }
    if (a.type === 'session/fetchSessions') {
      socket.emit('get-sessions');
    }
    if (a.type === 'chat/createRoom') {
      const payload = a.payload as { roomId: string; roomName: string; maxParticipants: number };
      socket.emit('create-room', payload);
    }
    return next(action);
  };
};
