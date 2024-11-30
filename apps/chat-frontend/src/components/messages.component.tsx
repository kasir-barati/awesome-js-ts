import { useEffect, useState } from 'react';
import { MESSAGE_BROADCASTED, MessagePayload } from 'shared';
import type { DefaultEventsMap } from 'socket.io';
import { Socket } from 'socket.io-client';
import { useAppContext } from '../app/app.context';

interface MessagesProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export function Messages({ socket }: Readonly<MessagesProps>) {
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const {
    state: { roomId },
  } = useAppContext();

  useEffect(() => {
    // WHY This listener is not invoked?
    // I can see no issue in my backend code.
    socket.on(MESSAGE_BROADCASTED, (message: MessagePayload) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        message,
      ]);
    });
  }, [socket]);

  return (
    <>
      <h2>Messages in room: {roomId}</h2>
      {messages.map((message) => (
        <p key={message.time}>{message.message}</p>
      ))}
    </>
  );
}
