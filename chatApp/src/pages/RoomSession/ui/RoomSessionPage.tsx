import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@/app/store/hooks';
import { setRoomId, resetChat } from '@/features/chat/model/chatSlice';
import { Chat } from '@/widgets/chat';

export function RoomSessionPage() {
  const dispatch = useAppDispatch();
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) return;
    dispatch(setRoomId(roomId));
    dispatch({ type: 'chat/joinRoom', payload: roomId });
    return () => {
      dispatch(resetChat());
    };
  }, [dispatch, roomId]);

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
