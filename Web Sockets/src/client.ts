import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { Request, Response } from 'express';

// serving client on localhost:3000
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.sendFile(_dirname + '/client.html');
});

app.listen(3000, () => {
  console.log(`client is running on port 3000`);
});
