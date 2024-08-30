import { useRef, useEffect } from 'react';
import { useSocket } from '../context/socket_context';
import { EVENTS } from '../config/event';

export const Messages = () => {
  const { messages, socket, roomId, userName, setMessages } = useSocket();

  const newMessageRef = useRef<HTMLTextAreaElement>(null);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const handleSendMessage = () => {
    const content = newMessageRef.current?.value;

    if (!content) return;

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
      roomId,
      content,
      userName,
    });

    const date = new Date();

    if (messages && content) {
      setMessages([
        ...messages,
        {
          userName: 'you',
          content,
          time: `${date.getHours()}:${date.getMinutes()}`,
        },
      ]);
    }

    if (newMessageRef.current) {
      newMessageRef.current.value = '';
    }
  };

  const handleReactions = () => {
    
  }

  return (
    <div>
      {messages?.map((message, index) => (
        <p key={index}>
          {message.time}: {message.userName === userName ? 'you' : userName}: {message.content}
        </p>
      ))}
      <div>
        <textarea rows={1} placeholder="message" ref={newMessageRef} />
        <button onClick={handleSendMessage} className="cta">send</button>
      </div>
    </div>
  );
};
