import type { Socket as ServerSocket } from 'socket.io';
import type { Socket as ClientSocket } from 'socket.io-client';

export function waitFor(
  socket: ServerSocket | ClientSocket,
  event: string,
) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}
