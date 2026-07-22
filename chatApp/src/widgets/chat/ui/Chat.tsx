import { useChat } from '@/features/chat/model/useChat';

import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

interface ChatProps {
  roomId: string;
}

export function Chat({ roomId }: ChatProps) {
  const { messages, text, setText, sendMessage } = useChat(roomId);

  return (
    <section aria-label="Чат">
      <MessageList messages={messages} />
      <MessageInput text={text} onChange={setText} onSubmit={sendMessage} />
    </section>
  );
}
