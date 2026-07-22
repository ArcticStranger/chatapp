import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log(process.env.SUPABASE_URL);
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10));

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface MessageData {
  roomId: string;
  text: string;
  sender: string;
}

interface CreateRoomData {
  roomId: string;
  roomName: string;
  maxParticipants: number;
}

const app = express();
app.use(cors());

app.get('/', (_req, res) => {
  res.send('App is running');
});

const distPath = path.join(process.cwd(), 'dist');
console.log('Serving static from:', distPath);

app.use(express.static(distPath));

app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: Socket) => {
  console.log(`Пользователь подключился: ${socket.id}`);

  socket.on('create-room', async (data: CreateRoomData, callback) => {
    const { error } = await supabase.from('sessions').insert({
      id: data.roomId,
      name: data.roomName,
      max_participants: data.maxParticipants,
    });

    if (error) {
      console.error('Supabase error:', error);
      callback?.({ ok: false, error: error.message });
      return;
    }

    console.log(`Комната создана: ${data.roomId}`);
    callback?.({ ok: true });
  });

  socket.on('join-room', async (roomId: string) => {
    socket.join(roomId);

    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select()
      .eq('room_id', roomId);

    if (messagesError) {
      console.error(messagesError);
      return;
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select()
      .eq('id', roomId)
      .single();

    if (sessionError) {
      console.error(sessionError);
    }

    socket.emit('room-joined', { messages, session });
    console.log(`Пользователь ${socket.id} вошел в комнату: ${roomId}`);
  });

  socket.on('get-sessions', async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select()
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return;
    }

    socket.emit('sessions-list', data);
  });

  socket.on('send-message', async (data: MessageData) => {
    const { data: insertedData, error } = await supabase
      .from('messages')
      .insert({
        room_id: data.roomId,
        text: data.text,
        sender: data.sender,
      })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return;
    }

    console.log(insertedData);
    socket.to(data.roomId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Пользователь отключился: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
