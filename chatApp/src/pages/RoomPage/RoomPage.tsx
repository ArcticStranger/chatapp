import { useState } from 'react';
import './RoomPage.css';
import { Input } from 'antd';
import { Flex, InputNumber, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { socket } from '@/shared/api/socket';

const sharedProps = {
  mode: 'spinner' as const,
  min: 2,
  max: 4,
  defaultValue: 2,
  style: { width: '40%', height: '4vh', fontSize: '1.5rem' },
};

export function RoomPage() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(2);

  const handleCreateRoom = () => {
    const id = nanoid(10);

    socket.connect();
    socket.emit(
      'create-room',
      {
        roomId: id,
        roomName: roomName.trim() || `Room ${id}`,
        maxParticipants,
      },
      (response: { ok: boolean; error?: string }) => {
        if (response.error) {
          console.error('Failed to create room:', response.error);
        }
      },
    );

    navigate(`/room/${id}`);
  };

  return (
    <>
      <h2>Создайте название комнаты:</h2>
      <Input
        placeholder="test"
        className="input-name-room"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <br />
      <h2>Макс. кол-во участников:</h2>
      <Flex vertical gap="medium">
        <InputNumber
          {...sharedProps}
          value={maxParticipants}
          onChange={(value) => setMaxParticipants(value ?? 2)}
        />
      </Flex>
      <br />
      <Flex gap="medium" wrap>
        <nav>
          <Button type="primary" className="btn-room-init" onClick={handleCreateRoom}>
            Создать
          </Button>
        </nav>
        <nav>
          <Link to="/home">
            <Button type="primary" className="btn-room-init" style={{ backgroundColor: 'red' }}>
              Отменить
            </Button>
          </Link>
        </nav>
      </Flex>
    </>
  );
}
