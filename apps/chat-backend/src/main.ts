import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import {
  JOIN_ROOM,
  JoinRoomPayload,
  MESSAGE_BROADCASTED,
  MessagePayload,
  SENT_MESSAGE,
} from 'shared';
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
  console.log('Connection established!');

  socket.on(JOIN_ROOM, ({ roomId, username }: JoinRoomPayload) => {
    console.log('Joined to ' + roomId);

    socket.join(roomId);
  });
  socket.on(SENT_MESSAGE, (payload: MessagePayload) => {
    console.log('Received message:');
    console.group();
    console.log(payload);
    console.groupEnd();

    socket.to(payload.roomId).emit(MESSAGE_BROADCASTED, payload);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected!');
  });
});

server.listen(
  port,
  host,
  console.log.bind(
    this,
    `Server is listening to http://${host}:${port}`,
  ),
);
