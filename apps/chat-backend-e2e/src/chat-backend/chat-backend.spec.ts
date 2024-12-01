import {
  JOIN_ROOM,
  JoinRoomPayload,
  MESSAGE_BROADCASTED,
  MessagePayload,
  SENT_MESSAGE,
} from 'shared';
import { dismantleSocket, setupSocket } from 'testing';

// https://stackoverflow.com/a/54390993/8784518
describe('My backend app for a Chat app', () => {
  it('should join a room and send a message', async () => {
    const roomId = 'some-room';
    const username = 'semicolon';
    const clientSocket = await setupSocket('http://localhost:4001');
    const joinRoomPayload: JoinRoomPayload = {
      roomId,
      username,
    };
    clientSocket.emit(JOIN_ROOM, joinRoomPayload);
    const messagePayload: MessagePayload = {
      roomId,
      message: 'Some message',
      username,
      time: new Date().toISOString(),
    };
    clientSocket.emit(SENT_MESSAGE, messagePayload);

    const broadcastedMessage = await new Promise<MessagePayload>(
      (resolve, reject) => {
        clientSocket.on(
          MESSAGE_BROADCASTED,
          (broadcastedMessage: MessagePayload) => {
            dismantleSocket(clientSocket);

            resolve(broadcastedMessage);
          },
        );

        setTimeout(
          () => reject(new Error('ConnectionTimedOut')),
          5000,
        );
      },
    );

    expect(broadcastedMessage).toStrictEqual({
      roomId,
      message: 'Some message',
      username,
      time: expect.any(String),
    } satisfies MessagePayload);
  }, 50000);
});
