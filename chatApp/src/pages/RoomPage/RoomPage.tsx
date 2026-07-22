import { useState } from 'react';
import './RoomPage.css';
import { Input } from 'antd';
import { Flex, InputNumber, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useAppDispatch } from '@/app/store/hooks';

const sharedProps = {
  mode: 'spinner' as const,
  min: 2,
  max: 4,
  defaultValue: 2,
  style: { width: '40%', height: '4vh', fontSize: '1.5rem' },
};

export function RoomPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [roomName, setRoomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(2);

  const handleCreateRoom = () => {
    const id = nanoid(10);

    dispatch({
      type: 'chat/createRoom',
      payload: {
        roomId: id,
        roomName: roomName.trim() || `Room ${id}`,
        maxParticipants,
      },
    });

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
