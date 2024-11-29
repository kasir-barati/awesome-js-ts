import { createServer } from 'http';
import { MY_MESSAGE_EVENT, MyMessageEventPayload } from 'shared';
import { Server } from 'socket.io';
import { getEnv } from './env.util';
import { isNotWhitelisted } from './is-not-whitelisted';

const { port } = getEnv();
const http = createServer();
const socketioServer = new Server(http, {
  cors: {
    origin(origin, callback) {
      // Browser does NOT set the "Origin" header unless the API call's domain is different from the one where the page is being served.
      // Ref: https://stackoverflow.com/a/63684532/8784518
      if (origin && isNotWhitelisted(origin)) {
        callback(new Error('CorsError'));
        return;
      }
      callback(null, true);
    },
    methods: ['GET', 'OPTIONS'],
  },
});

socketioServer.on('connection', (socket) => {
  socket.on(MY_MESSAGE_EVENT, (payload: MyMessageEventPayload) => {
    console.log('Broadcasting the message...', payload);
    socketioServer.emit(MY_MESSAGE_EVENT, payload);
  });
});

http.listen(
  port,
  console.log.bind(
    this,
    `Server is up and running on: http://localhost:${port}`,
  ),
);
