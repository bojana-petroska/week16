import { SOCKET_URL } from '../config/default';
import { createContext, useContext, useState } from 'react';
import socketID, { Socket } from 'socket.io-client';

interface IContext {
  socket: Socket;
  userName?: string;
  setUserName: (value?: string) => void;
}

export const socket = socketID(SOCKET_URL, { transports: ['websocket'] });
export const SocketContext = createContext<IContext>({
  socket,
  setUserName: () => {},
});

const SocketProvider = ({ children }: { children: React.ReactNode }) => {

  const [userName, setUserName] = useState<string | undefined>();
  
  return (
    <SocketContext.Provider value={{ socket, userName, setUserName }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
