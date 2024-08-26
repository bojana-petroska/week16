import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = createServer(app);

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

app.use('/static', (req, res) => {
  res.sendFile(_dirname);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log(`connected to a new client`);

  ws.on('message', (message: string) => {
    console.log(`reply: ${message}`);
    ws.send(`delivered`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN){ 
        client.send(`message to all: happy friday`);
      }
    });
  });

  ws.on('close', () => {
    console.log(`server is closed by client`);
  });
});

server.listen(8080, () => {
  console.log(`client is running on port 3000`);
});
