import { DndContext } from '@dnd-kit/core';

export function RoomPage() {
  return (
    <>
      <DndContext>
        <h1>header RoomPage</h1>
        <p>smth</p>
        {/* <div className="room-card" ref={setNodeRef} {...listeners} {...attributes}></div> */}
      </DndContext>
    </>
  );
}
