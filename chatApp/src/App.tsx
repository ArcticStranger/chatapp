import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/HomePage/HomePage';
import { RoomPage } from './pages/RoomPage/RoomPage';
import { Header } from './widgets/Header/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
