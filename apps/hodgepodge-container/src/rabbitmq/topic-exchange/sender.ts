import { Channel, connect, Connection } from 'amqplib';
import { randomUUID } from 'crypto';
import {
  TOPIC_EXCHANGE,
  USER_CREATED_ROUTING_KEY,
  USER_DELETED_ROUTING_KEY,
  USER_DEREGISTRAION_MAIL_QUEUE,
  USER_WELCOME_MAIL_QUEUE,
} from './constants';

export class Sender {
  private connection?: Connection;
  private channel?: Channel;

  async init() {
    this.connection = await connect(process.env.RABBITMQ_URI);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(TOPIC_EXCHANGE, 'topic');

    await this.channel.assertQueue(USER_WELCOME_MAIL_QUEUE);
    await this.channel.assertQueue(USER_DEREGISTRAION_MAIL_QUEUE);

    this.channel.publish(
      TOPIC_EXCHANGE,
      USER_CREATED_ROUTING_KEY,
      Buffer.from(
        JSON.stringify({ id: randomUUID(), email: 'some@jp.ck' }),
      ),
    );
    this.channel.publish(
      TOPIC_EXCHANGE,
      USER_DELETED_ROUTING_KEY,
      Buffer.from(randomUUID()),
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
