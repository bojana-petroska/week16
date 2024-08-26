import { WebSocketServer } from 'ws';

// web socket server code
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  // ws is the newly opened websocket or so called handshake
  console.log(`connected to a new client`);
  ws.on('message', (message: string) => {
    console.log(`message received from client: ${message}`); // from client
    ws.send(`I received your message that is saying: ${message}`); // to client
  });

  ws.on('close', () => {
    console.log(`server is closed by client`);
  });
  
});
