import { Channel, connect, Connection } from 'amqplib';
import {
  AUDIT_LOG_QUEUE,
  CREATED_ROUTING_KEY,
  DELETED_ROUTING_KEY,
  TOPIC_EXCHANGE,
  UPDATED_ROUTING_KEY,
} from './constants';

export class LoggerReceiver {
  private connection?: Connection;
  private channel?: Channel;

  async init() {
    this.connection = await connect(process.env.RABBITMQ_URI);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(TOPIC_EXCHANGE, 'topic');
    await this.channel.assertQueue(AUDIT_LOG_QUEUE);

    for (const routingKey of [
      CREATED_ROUTING_KEY,
      UPDATED_ROUTING_KEY,
      DELETED_ROUTING_KEY,
    ]) {
      await this.channel.bindQueue(
        AUDIT_LOG_QUEUE,
        TOPIC_EXCHANGE,
        routingKey,
      );
    }

    await this.channel.consume(
      AUDIT_LOG_QUEUE,
      (message) => {
        console.log(`Message for "${AUDIT_LOG_QUEUE}"`);
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
