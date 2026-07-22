import { Button, Input } from 'antd';
import { CopyOutlined, EnterOutlined } from '@ant-design/icons';
import './HomePage.css';
import { Link } from 'react-router-dom';
import useHomePage from '../model/useHomePage';

export function HomePage() {
  const model = useHomePage();

  return (
    <main className="home-page">
      <h1 className="home-title">Мессенджер здорового курильщика</h1>

      <p className="home-description">
        Живые сообщения, 100% осуждения и 0% понимания. Вставьте приглашение и залетайте в чат.
      </p>

      <div className="invite-link">
        <Input
          value={model.inviteLink}
          onChange={(event) => model.setInviteLink(event.target.value)}
          placeholder="Вставьте ссылку на комнату"
          size="large"
        />

        <Button icon={<CopyOutlined />} onClick={model.handlePasteLink} size="large" type="primary">
          Вставить
        </Button>

        {model.inviteLink && (
          <Button icon={<EnterOutlined />} onClick={model.handleJoinLink} size="large">
            Войти
          </Button>
        )}
      </div>

      {model.pasteError && <p className="invite-link-error">{model.pasteError}</p>}

      <section className="home-actions" aria-label="Действия с чатами">
        <Link to="/room" className="home-action home-action-create">
          <span className="home-action-title">Создать комнату чата</span>
          <span className="home-action-text">
            Начните новый разговор и отправьте приглашение собеседникам.
          </span>
        </Link>
        <button
          className="home-action home-action-list"
          type="button"
          onClick={model.toggleSessions}
        >
          <span className="home-action-title">Открыть список чатов</span>
          <span className="home-action-text">
            {model.sessionsOpen
              ? 'Скрыть список комнат'
              : 'Вернитесь к уже созданным комнатам и продолжите переписку.'}
          </span>
        </button>
      </section>

      {model.sessionsOpen && (
        <section className="session-list">
          <h2>Список комнат</h2>
          {model.sessions.length === 0 ? (
            <p className="session-list-empty">Нет созданных комнат</p>
          ) : (
            <ul className="session-list-items">
              {model.sessions.map((session) => (
                <li
                  key={session.id}
                  className="session-list-item"
                  onClick={() => model.handleSessionClick(session.id)}
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
