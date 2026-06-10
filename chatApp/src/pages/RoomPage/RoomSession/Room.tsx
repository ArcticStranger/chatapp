// import { StockOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
interface MessageData {
  roomId: string | undefined;
  text: string;
  sender: string | undefined;
}
// подключаемся к бэку
const socket = io('http://localhost:5000', { autoConnect: false });

export function Room() {
  const { roomId } = useParams(); // читает roomId из адрес строки
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.connect();
    // сообщаем что мы вошли в конкретную комнату серверу
    socket.emit('join-room', roomId);

    // слушаем новые сообщения от серва
    socket.on('receive-message', (message: MessageData) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive-message');
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageData: MessageData = {
      roomId: roomId || '',
      text,
      sender: socket.id || '',
    };

    // отправлем сообщение на сервер

    socket.emit('send-message', messageData);
    setMessages((prev) => [...prev, messageData]);
    setText('');
  };

  return (
    <div>
      <h3>
        Ссылка для приглашения:{' '}
        <code style={{ background: '#eee', padding: '4px' }}>{window.location.href}</code>
      </h3>
      <div
        className="chat-box"
        style={{ border: '1px solid ccc', height: '300px', overflowY: 'scroll' }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <b>{msg.sender === socket.id ? 'Вы' : 'Гость'}:</b> {msg.text}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Сообщение..." />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}
