import { MouseEvent, useRef } from 'react';
import {
  assertExists,
  isEmptyString,
  MessagePayload,
  SENT_MESSAGE,
} from 'shared';
import type { DefaultEventsMap } from 'socket.io';
import { Socket } from 'socket.io-client';
import { useAppContext } from '../app/app.context';

interface ChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export function Chat({ socket }: Readonly<ChatProps>) {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const {
    state: { roomId, username },
  } = useAppContext();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    assertExists(messageInputRef.current);

    if (isEmptyString(messageInputRef.current.value)) {
      return;
    }

    const messagePayload: MessagePayload = {
      roomId,
      message: messageInputRef.current.value.trim(),
      username,
      time: new Date().toISOString(),
    };

    socket.emit(SENT_MESSAGE, messagePayload);

    messageInputRef.current.value = '';
    messageInputRef.current.focus();
  }

  return (
    <>
      <form action="#">
        <input
          ref={messageInputRef}
          type="text"
          name="message"
          placeholder="Start typing..."
          autoFocus
        />
        <button type="submit" onClick={handleClick}>
          Let's chat!
        </button>
      </form>
    </>
  );
}
