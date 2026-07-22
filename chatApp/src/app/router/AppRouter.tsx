import { Route, Routes, Navigate } from 'react-router-dom';

import { HomePage } from '@/pages/HomePage';
import { RoomPage } from '@/pages/RoomPage';
import { RoomSessionPage } from '@/pages/room-session';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/room" element={<RoomPage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/room/:roomId" element={<RoomSessionPage />} />
    </Routes>
  );
}
