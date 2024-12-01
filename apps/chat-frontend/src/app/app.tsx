import { useEffect } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import { Chat } from '../components/chat.component';
import { Join } from '../components/join.component';
import { Messages } from '../components/messages.component';
import { Show } from '../components/show.component';
import { useAppContext } from './app.context';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
});

export default function App() {
  const { state } = useAppContext();

  useEffect(() => {
    function temp() {
      toast('Connected to the server!', {
        position: 'bottom-right',
        autoClose: 2000,
        closeOnClick: true,
        draggable: true,
        theme: 'dark',
      });
    }

    // Listen to the predefined event for successful connection
    socket.on('connect', temp);

    return () => {
      socket.off('connect', temp);
    };
  });

  return (
    <section>
      <Show when={state.roomId.length === 0}>
        <Join socket={socket} />
      </Show>
      <Show when={state.roomId.length > 0}>
        <Chat socket={socket} />
        <Messages socket={socket} />
      </Show>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </section>
  );
}
