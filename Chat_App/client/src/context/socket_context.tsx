import { SOCKET_URL } from '../config/default';
import { createContext, useContext, useState } from 'react';
import socketID, { Socket } from 'socket.io-client';
import { EVENTS } from '../config/event';

interface Room {
  id: string;
  name: string;
}

interface Message {
  userName: string;
  content: string;
  time: string;
}

interface UserProfile {
  displayName: string,
  avatar: string,
  themeColor: string,
}

interface IContext {
  socket: Socket;
  userName?: string;
  setUserName: (value?: string) => void;
  roomId?: string; // the room that the user had joined in
  rooms: Room[];
  messages?: Message[];
  setMessages: (value?: Message[]) => void;
  setUserProfile?: (value?: UserProfile) => void;
}

export const socket = socketID(SOCKET_URL, { transports: ['websocket'] });
export const SocketContext = createContext<IContext>({
  socket,
  setUserName: () => {},
  rooms: [{ id: '', name: '' }],
  setMessages: () => [],
  setUserProfile: () => {},
});

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [userName, setUserName] = useState<string | undefined>('');
  const [roomId, setRoomId] = useState<string | undefined>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[] | undefined>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();

  const userNameFromLocalStorage = localStorage.getItem('userName');

  if (userNameFromLocalStorage && !userName) {
    setUserName(userNameFromLocalStorage);
  }

  // the backend will fire an event and send us these details
  // frontend need to have an event listener for these events

  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setRoomId(value.roomId);
    setMessages(value.messages);
  });

  socket.on(EVENTS.SERVER.ROOM_MESSAGE, (value: Message) => {
    if (messages) {
      setMessages([...messages, value]);
    } else {
      console.log(value);
      setMessages([value]);
    }
  });

  return (
    <SocketContext.Provider
      value={{
        socket,
        userName,
        setUserName,
        roomId,
        rooms,
        messages,
        setMessages,
        setUserProfile,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
