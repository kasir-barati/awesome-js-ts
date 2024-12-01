import type { DefaultEventsMap } from 'socket.io';
import { io, Socket } from 'socket.io-client';

export function setupSocket(backendUrl: string) {
  return new Promise<Socket<DefaultEventsMap, DefaultEventsMap>>(
    (resolve, reject) => {
      const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(
        backendUrl,
        {
          forceNew: true,
          autoConnect: true,
          reconnectionDelay: 5000,
          reconnectionDelayMax: 5000,
          transports: ['websocket'],
        },
      );

      // Listen to the predefined event for successful connection
      socket.on('connect', () => {
        resolve(socket);
      });

      setTimeout(() => {
        reject(new Error('Failed to connect within 15 seconds.'));
      }, 15000);
    },
  );
}

export function dismantleSocket(socket: Socket) {
  return new Promise((resolve, reject) => {
    if (socket.connected) {
      console.info('Disconnecting from backend...');
      socket.disconnect();
      resolve(true);
      return;
    }

    console.info('Was not connected to the backend!');
    resolve(false);
  });
}
