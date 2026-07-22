import { useCallback, useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import { CopyOutlined, EnterOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { selectSessions, selectSessionsError } from '@/entities/session/model/sessionSlice';

export function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessions = useAppSelector(selectSessions);
  const sessionsError = useAppSelector(selectSessionsError);

  const [inviteLink, setInviteLink] = useState('');
  const [pasteError, setPasteError] = useState('');
  const [sessionsOpen, setSessionsOpen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'session/fetchSessions' });
  }, [dispatch]);

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
    (roomId: string) => navigate(`/room/${roomId}`),
    [navigate],
  );

  const toggleSessions = useCallback(() => {
    setSessionsOpen((prev) => {
      if (!prev) dispatch({ type: 'session/fetchSessions' });
      return !prev;
    });
  }, [dispatch]);

  return (
    <main className="home-page">
      <h1 className="home-title">Мессенджер здорового курильщика</h1>
      <p className="home-description">
        Живые сообщения, 100% осуждения и 0% понимания. Вставьте приглашение и залетайте в чат.
      </p>
      <div className="invite-link">
        <Input
          value={inviteLink}
          onChange={(event) => setInviteLink(event.target.value)}
          placeholder="Вставьте ссылку на комнату"
          size="large"
        />
        <Button icon={<CopyOutlined />} onClick={handlePasteLink} size="large" type="primary">
          Вставить
        </Button>
        {inviteLink && (
          <Button icon={<EnterOutlined />} onClick={handleJoinLink} size="large">
            Войти
          </Button>
        )}
      </div>
      {pasteError && <p className="invite-link-error">{pasteError}</p>}
      {sessionsError && <p className="invite-link-error">{sessionsError}</p>}
      <section className="home-actions" aria-label="Действия с чатами">
        <Link to="/room" className="home-action home-action-create">
          <span className="home-action-title">Создать комнату чата</span>
          <span className="home-action-text">
            Начните новый разговор и отправьте приглашение собеседникам.
          </span>
        </Link>
        <button className="home-action home-action-list" type="button" onClick={toggleSessions}>
          <span className="home-action-title">Открыть список чатов</span>
          <span className="home-action-text">
            {sessionsOpen
              ? 'Скрыть список комнат'
              : 'Вернитесь к уже созданным комнатам и продолжите переписку.'}
          </span>
        </button>
      </section>
      {sessionsOpen && (
        <section className="session-list">
          <h2>Список комнат</h2>
          {sessions.length === 0 ? (
            <p className="session-list-empty">Нет созданных комнат</p>
          ) : (
            <ul className="session-list-items">
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className="session-list-item"
                  onClick={() => handleSessionClick(session.id)}
                >
                  <span className="session-list-item-name">{session.name}</span>
                  <span className="session-list-item-meta">
                    Участников: {session.max_participants} &middot;{' '}
                    {new Date(session.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
