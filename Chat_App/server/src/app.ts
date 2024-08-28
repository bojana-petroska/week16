console.log('SERVER RUNNING');
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import config from 'config';
import logger from './utils/logger';
import socketServerHandler from './socket';

const port = config.get<number>('port');
const host = config.get<string>('host');
const corsOrigin = config.get<string>('corsOrigin');

const app = express();

app.options('*', cors({ origin: corsOrigin, credentials: true }));

const httpServer = createServer(app);

const socketServer = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
});

app.get('/', (_, res) => res.send(`the server is working`));

httpServer.listen(port, host, () => {
  logger.info(`the server is listening on port ${port}`);
  socketServerHandler({ socketServer });
});
