import { useState } from 'react';
import './RoomPage.css';
import Modal from './modal.tsx';
import { Input } from 'antd';
import type { InputNumberProps } from 'antd';
import { Flex, InputNumber, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

const sharedProps: InputNumberProps = {
  mode: 'spinner',
  min: 2,
  max: 4,
  defaultValue: 2,
  style: { width: '100%' },
};

export function RoomPage() {
  const navigate = useNavigate();
  const handleCreateRoom = () => {
    const id = nanoid(10);
    navigate(`/room/${id}`);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="room-page">
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>Вы уверены, что хотите отменить создание комнаты?</p>
      </Modal>

      <h2 className="room-page-title">Создание комнаты</h2>

      <label className="room-page-label" htmlFor="room-name">
        Название комнаты
      </label>
      <Input id="room-name" placeholder="Введите название комнаты" className="input-name-room" />

      <label className="room-page-label" htmlFor="room-members">
        Макс. количество участников
      </label>
      <Flex vertical gap="medium" style={{ maxWidth: 320 }}>
        <InputNumber id="room-members" {...sharedProps} placeholder="2" />
      </Flex>

      <Flex gap="medium" wrap className="room-page-actions">
        <Button type="primary" className="btn-room-init" onClick={handleCreateRoom}>
          Создать
        </Button>
        <Button type="default" className="btn-room-init" onClick={() => setIsOpen(true)}>
          Отменить
        </Button>
        <Link to="/home" className="btn-room-link">
          На главную
        </Link>
      </Flex>
    </main>
  );
}
