// @ts-check

const socket = io('ws://localhost:4000');

socket.on('connect', () => {
  alert('connected');
});
socket.on('ping', () => {
  alert('ping');
  socket.emit('pong', Date.now());
});

// The open event is fired when a connection with a WebSocket is opened.
socket.on('my-message-event', (payload) => {
  const messageElement = document.createElement('p');
  messageElement.classList.add(
    payload.user.username === 'kasir'
      ? 'openai-message'
      : 'user-message',
  );
  messageElement.innerText = payload.message;

  /**@type {HTMLDivElement | null} */
  const history = document.querySelector('.history');

  assertElementExists(history);

  history.appendChild(messageElement);
});

/**@param {MouseEvent} event  */
function handleClickOnSend(event) {
  event.preventDefault();

  /**@type {HTMLInputElement | null} */
  const messageInput = document.querySelector('.message');
  assertElementExists(messageInput);

  /**@type {HTMLInputElement | null} */
  const usernameElement = document.querySelector('.username');
  assertElementExists(usernameElement);
  const username = usernameElement.value;

  socket.emit('my-message-event', {
    message: messageInput.value,
    user: { id: username.slice(0, 3), username },
  });
  messageInput.value = '';
  messageInput.focus();
}

/**
 *
 * @param {HTMLElement | null} element
 * @throws {Error}
 * @returns {asserts element is HTMLElement}
 */
function assertElementExists(element) {
  if (!element) {
    throw new Error('NotAnElement');
  }
}
