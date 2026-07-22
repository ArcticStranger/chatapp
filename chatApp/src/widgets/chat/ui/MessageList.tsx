import type { Message } from '@/entities/message/model/types';
import { socket } from '@/shared/api/socket';

import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  hostId: string | null;
}

export function MessageList({ messages, hostId }: MessageListProps) {
  return (
    <div className="chat-box">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          text={message.text}
          isOwn={message.sender === socket.id}
          isHost={message.sender === hostId}
        />
      ))}
    </div>
  );
}
