import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { MESSAGE_BROADCASTED, MessagePayload } from 'shared';
import { DefaultEventsMap } from 'socket.io';
import { Socket } from 'socket.io-client';
import { useAppContext } from '../app/app.context';
import styles from './messages.module.css';

interface MessagesProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export function Messages({ socket }: Readonly<MessagesProps>) {
  const {
    state: { roomId, username },
  } = useAppContext();
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  // In the docs it says do not register event listeners in your child components, because it ties the state of the UI with the time of reception of the events.
  // In other word if the component is not mounted, then some messages might be missed.
  // But this is really important to use since we do not mind loosing messages before this component gets mounted.
  useEffect(() => {
    function onMessageBroadcasted(message: MessagePayload) {
      setMessages((previousMessages) => [
        ...previousMessages,
        message,
      ]);
    }

    socket.on(MESSAGE_BROADCASTED, onMessageBroadcasted);

    // You need to delete the listener to not process same message twice!
    return () => {
      socket.off(MESSAGE_BROADCASTED, onMessageBroadcasted);
    };
  }, [socket]);

  return (
    <section className={styles.section}>
      <h2>
        Messages in room:{' '}
        <span className={styles['section__room-id']}>{roomId}</span>
      </h2>
      {messages.map((message) => (
        <p
          className={classNames({
            [styles.mine]: username === message.username,
          })}
          key={message.time}
        >
          {message.message}
        </p>
      ))}
    </section>
  );
}
