import { Server, Socket } from 'socket.io';
import logger from './utils/logger';
import { v4 } from 'uuid';

interface Room {
  id: string;
  name: string;
}

interface Messages {
  [roomId: string]: {
    content: string;
    userName: string;
    time: string;
  }[];
}

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    JOIN_ROOM: 'JOIN_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
  },
};

const rooms: Room[] = [];
const messages: Messages = {};

function socketServerHandler({ socketServer }: { socketServer: Server }) {
  logger.info('socket is enabled');

  socketServer.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`new client connected with an id of: ${socket.id}`);

    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      logger.info(`connection ${socket.id} created room: ${roomName}`);

      
      const roomId = v4();
      rooms.push({ id: roomId, name: roomName });
      
      socket.join(roomId);
      
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
      
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
    
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, content, userName }) => {
        logger.info(
          `new message by ${userName} in room ${roomId}: ${content}`
        );

        const date = new Date();

        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          content,
          userName,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
        messages[roomId] = messages[roomId] || [];
        messages[roomId].push({
          content,
          userName,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );

    socket.on(EVENTS.CLIENT.JOIN_ROOM, ({ roomId }) => {
      logger.info(`connection ${socket.id} joined room: ${roomId}`);
      logger.info(messages)
      socket.join(roomId);
      socket.emit(EVENTS.SERVER.JOINED_ROOM, {
        roomId,
        messages: messages[roomId] || [],
      });
    });
  });
}

export default socketServerHandler;
