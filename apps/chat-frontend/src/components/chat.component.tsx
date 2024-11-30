import { KeyboardEvent, MouseEvent, useRef } from 'react';
import {
  assertExists,
  isEmptyString,
  MessagePayload,
  SENT_MESSAGE,
} from 'shared';
import type { DefaultEventsMap } from 'socket.io';
import { Socket } from 'socket.io-client';
import { useAppContext } from '../app/app.context';
import styles from './chat.module.css';

interface ChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export function Chat({ socket }: Readonly<ChatProps>) {
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    state: { roomId, username },
  } = useAppContext();

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (isCtrlEnter(event)) {
      handleClick();
    }
  }
  function handleClick(event?: MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();

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
    <section className={styles.section}>
      <form action="#">
        <textarea
          ref={messageInputRef}
          name="message"
          placeholder="Start typing..."
          autoFocus
          onKeyDown={handleKeyDown}
        ></textarea>
        <button aria-label="Send" type="submit" onClick={handleClick}>
          &#8617;
        </button>
      </form>
    </section>
  );
}

function isCtrlEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
  return event.ctrlKey && event.key === 'Enter';
}
