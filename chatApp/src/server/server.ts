import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

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
  socket.on('join-room', async (roomId: string) => {
    socket.join(roomId);

    const { data, error } = await supabase.from('messages').select();
    if (error) {
      console.error(error);
      return;
    }

    console.log(data);
    console.log(`Пользователь ${socket.id} вошел в комнату: ${roomId}`);
  });

  // Пересылка сообщений между участниками конкретной комнаты
  socket.on('send-message', async (data: MessageData) => {
    // Отправляем сообщение всем в комнате, кроме самого отправителя

    const { error } = await supabase
      .from('messages')
      .insert({ room_id: data.roomId, text: data.text, sender: data.sender });
    socket.to(data.roomId).emit('receive-message', data);
    if (error) {
      console.log(error);
      return;
    }
  });

  socket.on('disconnect', () => {
    console.log(`Пользователь отключился: ${socket.id}`);
  });
});

// 4. Сервер слушает порт 5000
server.listen(5000, () => console.log('Сервер успешно запущен на порту 5000'));
