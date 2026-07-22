import { useParams } from 'react-router-dom';

import { Chat } from '@/widgets/chat';

export function RoomSessionPage() {
  const { roomId } = useParams();

  if (!roomId) return <p>Не указан идентификатор комнаты.</p>;

  return (
    <main>
      <h3>
        Ссылка для приглашения: <code className="link-window">{window.location.href}</code>
      </h3>
      <Chat roomId={roomId} />
    </main>
  );
}
