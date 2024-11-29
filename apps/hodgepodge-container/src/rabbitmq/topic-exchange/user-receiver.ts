import { Channel, connect, Connection } from 'amqplib';
import {
  TOPIC_EXCHANGE,
  USER_CREATED_ROUTING_KEY,
  USER_DELETED_ROUTING_KEY,
  USER_DEREGISTRAION_MAIL_QUEUE,
  USER_WELCOME_MAIL_QUEUE,
} from './constants';

export class UserReceiver {
  private connection?: Connection;
  private channel?: Channel;

  async init() {
    this.connection = await connect(process.env.RABBITMQ_URI);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(TOPIC_EXCHANGE, 'topic');
    await this.channel.assertQueue(USER_WELCOME_MAIL_QUEUE);
    await this.channel.assertQueue(USER_DEREGISTRAION_MAIL_QUEUE);

    await this.channel.bindQueue(
      USER_WELCOME_MAIL_QUEUE,
      TOPIC_EXCHANGE,
      USER_CREATED_ROUTING_KEY,
    );
    await this.channel.bindQueue(
      USER_DEREGISTRAION_MAIL_QUEUE,
      TOPIC_EXCHANGE,
      USER_DELETED_ROUTING_KEY,
    );

    await this.channel.consume(
      USER_WELCOME_MAIL_QUEUE,
      (message) => {
        console.log(`Message for "${USER_WELCOME_MAIL_QUEUE}"`);
        console.log(message?.content?.toString());
      },
      { noAck: true },
    );
    await this.channel.consume(
      USER_DEREGISTRAION_MAIL_QUEUE,
      (message) => {
        console.log(`Message for "${USER_DEREGISTRAION_MAIL_QUEUE}"`);
        console.log(message?.content?.toString());
      },
      { noAck: true },
    );
  }

  async cleanup() {
    if (!this.channel || !this.connection) {
      return;
    }

    await this.channel.close();
    await this.connection.close();
  }
}
