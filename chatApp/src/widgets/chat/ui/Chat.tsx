import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import {
  selectMessages,
  selectHostId,
  selectText,
  addMessage,
  setText,
} from '@/features/chat/model/chatSlice';
import { socket } from '@/shared/api/socket';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

interface ChatProps {
  roomId: string;
}

export function Chat({ roomId }: ChatProps) {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const hostId = useAppSelector(selectHostId);
  const text = useAppSelector(selectText);

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const message = {
      id: crypto.randomUUID(),
      roomId,
      text: trimmedText,
      sender: socket.id ?? '',
    };

    dispatch(addMessage(message));
    dispatch({ type: 'chat/sendMessage', payload: message });
    dispatch(setText(''));
  };

  return (
    <section aria-label="Чат">
      <MessageList messages={messages} hostId={hostId} />
      <MessageInput text={text} onChange={(v) => dispatch(setText(v))} onSubmit={sendMessage} />
    </section>
  );
}
