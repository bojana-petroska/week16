import { useRef } from 'react';
import { useSocket } from '../context/socket_context';
import { EVENTS } from '../config/event';

export const Messages = () => {
  const { messages, socket, roomId, userName } = useSocket();

  const newMessageRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    const content = newMessageRef.current?.value;

    if (!content) return;
    
    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
      roomId,
      content,
      userName,
    });

    if (newMessageRef.current) {
        newMessageRef.current.value = ''
    }

  };

  return (
    <div>
      {messages?.map(({ userName, content, time }, index) => (
        <p key={index}>
          {time}: {userName}: {content}
        </p>
      ))}
      <div>
        <textarea rows={1} placeholder="message" ref={newMessageRef} />
        <button onClick={handleSendMessage}>send</button>
      </div>
    </div>
  );
};
