import { useRef } from 'react';
import { useSocket } from '../context/socket_context';
import { EVENTS } from '../config/event';

export const Rooms = () => {
  const newRoomRef = useRef<HTMLInputElement>(null);
  const { socket, rooms, roomId } = useSocket();

  const handleCreateRoom = () => {
    const roomName = newRoomRef.current?.value || '';
    if (!roomName) return;

    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

    if (newRoomRef.current) {
      newRoomRef.current.value = '';
    }
  };

  const handleJoinRoom = (id: string) => {
    if (roomId === id) return; // the user is already in this room
    // const room = rooms.find((room) => room.id === id);
    // if (!room) return;
    // const { name } = room;

    socket.emit(EVENTS.CLIENT.JOIN_ROOM, { roomId: id });
    console.log(`joined room: ${id}`);
  };

  return (
    <div>
      <input placeholder="room name" ref={newRoomRef} />
      <button onClick={handleCreateRoom} className="cta">
        create room
      </button>
      <div>
        {rooms.map(({ id, name }) => (
          <div key={id}>
            <button disabled={roomId === id} onClick={() => handleJoinRoom(id)}>
              {name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
