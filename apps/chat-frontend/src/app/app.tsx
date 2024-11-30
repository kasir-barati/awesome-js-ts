import io from 'socket.io-client';
import { Chat } from '../components/chat.component';
import { Join } from '../components/join.component';
import { Messages } from '../components/messages.component';
import { Show } from '../components/show.component';
import { useAppContext } from './app.context';
import styles from './app.module.css';

const socket = io(import.meta.env.VITE_BACKEND_URL);

export default function App() {
  const { state } = useAppContext();

  return (
    <section className={styles.test}>
      <Show when={state.roomId.length === 0}>
        <Join socket={socket} />
      </Show>
      <Show when={state.roomId.length > 0}>
        <Chat socket={socket} />
        <Messages socket={socket} />
      </Show>
    </section>
  );
}
