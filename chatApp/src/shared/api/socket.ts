import { io } from 'socket.io-client';
import 'dotenv/config';
export const socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: false });
