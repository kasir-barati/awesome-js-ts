import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getEnv } from './utils/env.util';
import { origin } from './utils/origin.util';

const { port, host } = getEnv();
const app = express();

app.use(
  cors({
    origin,
  }),
);

const server = createServer(app);
const socketioServer = new Server(server, {
  cors: {
    origin,
  },
});

socketioServer.on('connection', (socket) => {
  socket.id;
});

server.listen(
  port,
  host,
  console.log.bind(
    this,
    `Server is listening to http://${host}:${port}`,
  ),
);
