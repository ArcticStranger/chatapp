import { useCallback, useEffect, useState } from 'react';

import type { Message } from '@/entities/message/model/types';
import { socket } from '@/shared/api/socket';

interface RoomJoinedData {
  messages: Message[];
  session: unknown;
}

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const receiveMessage = (message: Message) => setMessages((current) => [...current, message]);

    const handleRoomJoined = (data: RoomJoinedData) => {
      setMessages(data.messages ?? []);
    };

    socket.connect();
    socket.emit('join-room', roomId);
    socket.on('receive-message', receiveMessage);
    socket.on('room-joined', handleRoomJoined);

    return () => {
      socket.off('receive-message', receiveMessage);
      socket.off('room-joined', handleRoomJoined);
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedText = text.trim();
      if (!trimmedText) return;

      const message: Message = {
        id: crypto.randomUUID(),
        roomId,
        text: trimmedText,
        sender: socket.id ?? '',
      };

      socket.emit('send-message', message);
      setMessages((current) => [...current, message]);
      setText('');
    },
    [roomId, text],
  );

  return { messages, text, setText, sendMessage };
}
