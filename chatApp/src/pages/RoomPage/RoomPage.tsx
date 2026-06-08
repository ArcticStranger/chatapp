// import Draggable from 'react-draggable';
import { useState } from 'react';
import './RoomPage.css';
import Modal from './modal.tsx';
import { Input } from 'antd';
import type { InputNumberProps } from 'antd';
import { Flex, InputNumber } from 'antd';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const sharedProps = {
  mode: 'spinner' as const,
  min: 2,
  max: 4,
  defaultValue: 2,
  onChange,
  style: { width: '40%', height: '4vh', fontSize: '1.5rem' },
};
export function RoomPage() {
  // const nodeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  return (
    // <Draggable nodeRef={nodeRef}>
    <>
      <button className="room-elem" onClick={() => setIsOpen(true)}>
        Drag me
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>some text of modal</p>
      </Modal>
      <h2>Создайте название комнаты:</h2>
      <Input placeholder="test" className="input-name-room" />
      <br />
      <h2>Макс. кол-во участников:</h2>
      <Flex vertical gap="medium">
        <InputNumber {...sharedProps} placeholder="Outlined" />
      </Flex>
    </>
    // </Draggable>
  );
}
