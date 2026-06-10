import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

// 1. Описываем интерфейс сообщения
interface MessageData {
  roomId: string;
  text: string;
  sender: string;
}

const app = express();
app.use(cors());

const server = createServer(app);

// 2. Настраиваем CORS для подключения вашего React-приложения (порт 5173)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// 3. Вместо any используем встроенный тип Socket из socket.io
io.on('connection', (socket: Socket) => {
  console.log(`Пользователь подключился: ${socket.id}`);

  // Юзер сообщает, в какую комнату хочет войти
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    console.log(`Пользователь ${socket.id} вошел в комнату: ${roomId}`);
  });

  // Пересылка сообщений между участниками конкретной комнаты
  socket.on('send-message', (data: MessageData) => {
    // Отправляем сообщение всем в комнате, кроме самого отправителя
    socket.to(data.roomId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Пользователь отключился: ${socket.id}`);
  });
});

// 4. Сервер слушает порт 5000
server.listen(5000, () => console.log('Сервер успешно запущен на порту 5000'));
