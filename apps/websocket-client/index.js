// @ts-check

const socket = new WebSocket('ws://localhost:3000');

// The open event is fired when a connection with a WebSocket is opened.
socket.onopen =
  /**@param {Event} event  */
  (event) => {
    alert('Connected to the backend!');
  };

socket.onmessage =
  /**@param {MessageEvent} event  */
  (event) => {
    const openaiMessageElement = document.createElement('p');
    openaiMessageElement.classList.add('openai-message');
    openaiMessageElement.innerText = event.data.toString();

    /**@type {HTMLInputElement | null} */
    const userMessage = document.querySelector('.message');

    assertElementExists(userMessage);

    const userMessageElement = document.createElement('p');
    userMessageElement.classList.add('user-message');
    userMessageElement.innerText = userMessage.value;
    userMessage.value = '';

    /**@type {HTMLDivElement | null} */
    const history = document.querySelector('.history');

    assertElementExists(history);

    history.appendChild(openaiMessageElement);
    history.appendChild(userMessageElement);
    userMessage.focus();
  };

/**@param {MouseEvent} event  */
function handleClickOnSend(event) {
  event.preventDefault();

  /**@type {HTMLInputElement | null} */
  const messageInput = document.querySelector('.message');

  assertElementExists(messageInput);

  socket.send(messageInput.value);
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
