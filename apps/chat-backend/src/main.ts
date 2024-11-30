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
const io = new Server(server, {
  cors: {
    origin,
  },
});

io.on('connection', (socket) => {
  console.log('Connection established!');

  socket.on(
    JOIN_ROOM,
    async ({ roomId, username }: JoinRoomPayload) => {
      console.log('Joined to room: ' + roomId);

      // Adds the client (with this socket) to the room they have specified!
      await socket.join(roomId);
    },
  );
  socket.on(SENT_MESSAGE, (payload: MessagePayload) => {
    console.log('Received message:');
    console.group();
    console.log(payload);
    console.groupEnd();

    // broadcast to clients that have joined the given room.
    // NOTE: socket.to(payload.roomId).emit(MESSAGE_BROADCASTED, payload) won\t do the job
    // Because according to the doc, "the socket itself being excluded". and we do not want that
    // Ref: https://socket.io/docs/v4/server-api/#sockettoroom
    io.to(payload.roomId).emit(MESSAGE_BROADCASTED, payload);
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
