import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  SearchOutlined,
  SettingOutlined,
  MessageOutlined,
  StarOutlined,
  TeamOutlined,
  MoreOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  SmileOutlined,
  PaperClipOutlined,
  SendOutlined,
  CheckOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import './Room.css';

interface MessageData {
  roomId: string | undefined;
  text: string;
  sender: string | undefined;
  timestamp?: number;
}

interface StoredMessage extends MessageData {
  timestamp: number;
}

const socket = io('http://localhost:5000', { autoConnect: false });

const EMOJIS = [
  '😀',
  '😂',
  '😍',
  '🤔',
  '👍',
  '🙏',
  '🔥',
  '🎉',
  '❤️',
  '😎',
  '😅',
  '😢',
  '🥳',
  '🤯',
  '💪',
  '👀',
];

const SIDEBAR_ITEMS = [
  { id: 'current', label: 'Общий чат', icon: MessageOutlined, unread: 2 },
  { id: 'starred', label: 'Избранное', icon: StarOutlined },
  { id: 'groups', label: 'Группы', icon: TeamOutlined },
];

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function Room() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeChat, setActiveChat] = useState('current');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();
    socket.emit('join-room', roomId);

    socket.on('receive-message', (message: MessageData) => {
      setMessages((prev) => [...prev, { ...message, timestamp: Date.now() }]);
    });

    return () => {
      socket.off('receive-message');
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageData: MessageData = {
      roomId: roomId || '',
      text,
      sender: socket.id || '',
    };

    socket.emit('send-message', messageData);
    setMessages((prev) => [...prev, { ...messageData, timestamp: Date.now() }]);
    setText('');
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmoji(false);
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const isOwn = (sender: string | undefined) => sender === socket.id;

  return (
    <div className="messenger">
      {/* ---- Sidebar ---- */}
      <aside className="messenger-sidebar">
        <div className="sidebar-profile">
          <div className="avatar avatar--me">В</div>
          <div className="sidebar-profile-info">
            <span className="sidebar-profile-name">Вы</span>
            <span className="sidebar-profile-status">в сети</span>
          </div>
        </div>

        <div className="sidebar-search">
          <SearchOutlined />
          <input className="sidebar-search-input" placeholder="Поиск" />
        </div>

        <div className="sidebar-section-label">Чаты</div>
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${activeChat === item.id ? 'sidebar-nav-item--active' : ''}`}
                onClick={() => setActiveChat(item.id)}
              >
                <Icon className="sidebar-nav-icon" />
                <span>{item.label}</span>
                {item.unread ? <span className="sidebar-badge">{item.unread}</span> : null}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-nav-item" onClick={copyInvite}>
            {copied ? (
              <CheckOutlined className="sidebar-nav-icon" />
            ) : (
              <CopyOutlined className="sidebar-nav-icon" />
            )}
            <span>{copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}</span>
          </button>
          <button type="button" className="sidebar-nav-item">
            <SettingOutlined className="sidebar-nav-icon" />
            <span>Настройки</span>
          </button>
        </div>
      </aside>

      {/* ---- Main chat ---- */}
      <main className="messenger-main">
        <header className="chat-topbar">
          <div className="chat-topbar-left">
            <div className="avatar avatar--room">О</div>
            <div className="chat-topbar-info">
              <span className="chat-topbar-title">Общий чат</span>
              <span className="chat-topbar-status">
                <span className="chat-online-dot" />
                Комната #{roomId} · в сети
              </span>
            </div>
          </div>
          <div className="chat-topbar-actions">
            <button type="button" className="topbar-btn" aria-label="Поиск">
              <SearchOutlined />
            </button>
            <button type="button" className="topbar-btn" aria-label="Звонок">
              <PhoneOutlined />
            </button>
            <button type="button" className="topbar-btn" aria-label="Видеозвонок">
              <VideoCameraOutlined />
            </button>
            <button type="button" className="topbar-btn" aria-label="Ещё">
              <MoreOutlined />
            </button>
          </div>
        </header>

        <div className="chat-window">
          <div className="chat-date-divider">
            <span>Сегодня</span>
          </div>

          {messages.length === 0 && (
            <div className="chat-empty">Сообщений пока нет. Напишите первым!</div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${isOwn(msg.sender) ? 'chat-message--own' : ''}`}
            >
              <div className="chat-message-bubble">
                {!isOwn(msg.sender) && <span className="chat-message-author">Гость</span>}
                <div className="chat-message-row">
                  <span className="chat-message-text">{msg.text}</span>
                  <span className="chat-message-time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-composer">
          <div className={`emoji-picker ${showEmoji ? 'emoji-picker--open' : ''}`}>
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="emoji-picker-item"
                onClick={() => insertEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <form className="chat-form" onSubmit={sendMessage}>
            <button
              type="button"
              className="composer-btn"
              aria-label="Эмодзи"
              onClick={() => setShowEmoji((v) => !v)}
            >
              <SmileOutlined />
            </button>
            <button type="button" className="composer-btn" aria-label="Вложение">
              <PaperClipOutlined />
            </button>
            <input
              className="chat-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Написать сообщение..."
            />
            <button
              className="chat-send"
              type="submit"
              disabled={!text.trim()}
              aria-label="Отправить"
            >
              <SendOutlined />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
