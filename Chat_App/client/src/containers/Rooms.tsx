import { useRef } from 'react';
import { useSocket } from '../context/socket_context';
import { EVENTS } from '../config/event';

export const Rooms = () => {
  const newRoomRef = useRef<HTMLInputElement>(null);
  const { socket, rooms } = useSocket();

  const handleCreateRoom = () => {
    const roomName = newRoomRef.current?.value || '';
    if (!roomName) return;

    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

    if (newRoomRef.current) {
      newRoomRef.current.value = '';
    }
  };

  return (
    <div>
      <input placeholder="room name" ref={newRoomRef} />
      <button onClick={handleCreateRoom}>create room</button>
      <div>
        {rooms.map(({ id, name }) => (
          <div key={id}>{name}</div>
        ))}
      </div>
    </div>
  );
};
