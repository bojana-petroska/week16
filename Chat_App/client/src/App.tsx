import React from 'react';
import './App.css';
import { useSocket } from './context/socket_context';
import { useState, useEffect } from 'react';
import { Messages, Rooms } from './containers';

function App() {
  const { socket } = useSocket();
  const [socketId, setSocketId] = useState<string | undefined>();
  const [userNameInput, setUserNameInput] = useState<string | undefined>('');

  const handleUserName = () => {
    if (!userNameInput) {
      return;
    }
    localStorage.setItem('userName', userNameInput)
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket);
      setSocketId(socket.id)
    })
    return () => {
      socket.off('connect');
    };
  }, [socket])

  return (
    <div>
      <div>
        <input type="text" placeholder="username" value={userNameInput} onChange={(e) => setUserNameInput(e.target.value)}/>
        <button onClick={handleUserName}>login</button>
      </div>
    <div className="App">
      {socketId}
      <Messages />
      <Rooms />
    </div>
    </div>
  );
}

export default App;
