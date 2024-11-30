import { ChangeEvent, MouseEvent, useState } from 'react';
import { isEmptyString, JOIN_ROOM, JoinRoomPayload } from 'shared';
import type { DefaultEventsMap } from 'socket.io';
import { Socket } from 'socket.io-client';
import { useAppContext } from '../app/app.context';
import styles from './join.module.css';

interface JoinProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export function Join({ socket }: Readonly<JoinProps>) {
  const [username, setUsername] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const { dispatch } = useAppContext();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (isEmptyString(roomId) || isEmptyString(username)) {
      return;
    }

    socket.connect();
    dispatch({
      type: 'set',
      payload: {
        roomId,
        username,
      },
    });
    socket.emit(JOIN_ROOM, {
      roomId,
      username,
    } satisfies JoinRoomPayload);
    setRoomId('');
    setUsername('');
  }
  function handleUsernameChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setUsername(event.currentTarget.value.trim());
  }
  function handleRoomIdChange(event: ChangeEvent<HTMLInputElement>) {
    setRoomId(event.currentTarget.value.trim());
  }

  return (
    <section className={styles.section}>
      <h1>Join a chat</h1>
      <form action="#">
        <input
          type="text"
          name="username"
          value={username}
          placeholder="kasir-barati"
          onChange={handleUsernameChange}
          autoFocus
          required
        />
        <input
          type="text"
          name="roomId"
          value={roomId}
          placeholder="123456789"
          onChange={handleRoomIdChange}
          required
        />
        <button type="submit" onClick={handleClick}>
          Let's chat!
        </button>
      </form>
    </section>
  );
}
