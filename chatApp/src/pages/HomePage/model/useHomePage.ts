import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Session } from '@/entities/session/model/types';
import { socket } from '@/shared/api/socket';

export default function useHomePage() {
  const navigate = useNavigate();
  const [inviteLink, setInviteLink] = useState('');
  const [pasteError, setPasteError] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsOpen, setSessionsOpen] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.emit('get-sessions');
    socket.on('sessions-list', (data: Session[]) => setSessions(data));

    return () => {
      socket.off('sessions-list');
      socket.disconnect();
    };
  }, []);

  const handlePasteLink = async () => {
    setPasteError('');

    if (!navigator.clipboard?.readText) {
      setPasteError('Браузер не разрешил прочитать буфер обмена');
      return;
    }

    const clipboardText = await navigator.clipboard.readText();

    if (!clipboardText.trim()) {
      setPasteError('В буфере обмена пусто');
      return;
    }

    setInviteLink(clipboardText);
  };

  const handleJoinLink = useCallback(() => {
    const match = inviteLink.match(/\/room\/([a-zA-Z0-9_-]+)/);
    if (match) {
      navigate(`/room/${match[1]}`);
    } else {
      setPasteError('Неверный формат ссылки. Пример: http://localhost:5173/room/abc123');
    }
  }, [inviteLink, navigate]);

  const handleSessionClick = useCallback(
    (roomId: string) => {
      navigate(`/room/${roomId}`);
    },
    [navigate],
  );

  const toggleSessions = useCallback(() => {
    setSessionsOpen((prev) => !prev);
    if (!sessionsOpen) {
      socket.connect();
      socket.emit('get-sessions');
      socket.on('sessions-list', (data: Session[]) => setSessions(data));
    }
  }, [sessionsOpen]);

  return {
    inviteLink,
    setInviteLink,
    pasteError,
    setPasteError,
    handlePasteLink,
    handleJoinLink,
    sessions,
    sessionsOpen,
    toggleSessions,
    handleSessionClick,
  };
}
