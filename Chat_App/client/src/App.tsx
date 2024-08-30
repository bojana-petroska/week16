import React from 'react';
import './App.css';
import { useSocket } from './context/socket_context';
import { useState, useEffect } from 'react';
import { Messages, Rooms } from './containers';
import styles from './styles/App.module.css';
import { UserProfile } from './containers/UserProfile';

function App() {
  const { socket, userName, setUserName } = useSocket();
  const [socketId, setSocketId] = useState<string | undefined>();
  const [userNameInput, setUserNameInput] = useState<string | undefined>('');

  const handleUserName = () => {
    if (!userNameInput) {
      return;
    }
    setUserName(userNameInput);
    localStorage.setItem('userName', userNameInput);
  };

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
    });
    return () => {
      socket.off('connect');
    };
  }, [socket]);

  if (!userName) {
    return (
      <div className={styles.userNameWrapper}>
        {/* <UserProfile /> */}
        <div className={styles.userNameInner}>
          <input
            type="text"
            placeholder="username"
            value={userNameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
          />
          <button onClick={handleUserName}>login</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {socketId}
      <Rooms />
      <Messages />
    </div>
  );
}

export default App;
