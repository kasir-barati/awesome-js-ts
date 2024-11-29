import { dismantleSocket, setupSocket } from 'testing';

interface ServerResponse {
  message: string;
}

// https://stackoverflow.com/a/54390993/8784518
describe('My backend app for a Chat app', () => {
  it.skip('should work', async () => {
    const clientSocket = await setupSocket('localhost:4001');
    const data4Server = { message: 'CLIENT ECHO' };
    const serverResponse = new Promise<ServerResponse>(
      (resolve, reject) => {
        clientSocket.on(
          'even-name',
          (data4Client: ServerResponse) => {
            dismantleSocket(clientSocket);

            resolve(data4Client);
          },
        );

        setTimeout(
          () => reject(new Error('ConnectionTimedOut')),
          5000,
        );
      },
    );

    clientSocket.emit('event-name', data4Server);
    const { message } = await serverResponse;

    expect(message).toBe('SERVER ECHO');
  });
});
