import { connect } from 'mongoose';
import OpenAI from 'openai';
import { Server } from 'ws';
import { getEnv } from './env.util';
import { Sender } from './message.model';
import { MessageRepository } from './message.repository';

const { port, databaseUrl, dbName, openaiApiKey } = getEnv();
const server = new Server({ port });
const openai = new OpenAI({ apiKey: openaiApiKey });
const messageRepository = new MessageRepository();

(async () => {
  await connect(databaseUrl, { dbName });

  server.on('connection', (socket, request) => {
    socket.on('message', async (message, isBinary) => {
      const promises: Promise<any>[] = [];
      const stringifiedMessage = message.toString();

      promises.push(
        messageRepository.create({
          message: stringifiedMessage,
          sender: Sender.user,
        }),
      );

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: stringifiedMessage }],
      });
      const openaiMessage = completion.choices[0].message.content;

      promises.push(
        messageRepository.create({
          message: openaiMessage,
          sender: Sender.openai,
        }),
      );

      await Promise.all(promises);

      socket.send(openaiMessage);
    });
  });
  server.on('listening', () => {
    console.log(
      `WebSocket server is up and running on: ws://localhost:${port}`,
    );
  });
})()
  .then()
  .catch(console.error);
