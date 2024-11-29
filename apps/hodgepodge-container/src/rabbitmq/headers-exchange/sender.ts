import { Channel, connect, Connection } from 'amqplib';

export class Sender {
  private connection?: Connection;
  private channel?: Channel;

  async init() {
    this.connection = await connect(process.env.RABBITMQ_URI);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange('amq.headers', 'headers');
    await this.channel.assertQueue('some.queue');

    this.channel.publish('amq.headers', '', Buffer.from('verify'), {
      headers: { 'driver-verification-req': 'some.queue' },
    });
    this.channel.publish('amq.headers', '', Buffer.from('log me'), {
      headers: { 'audit-log': 'log' },
    });
    this.channel.publish('amq.headers', '', Buffer.from('lost'), {
      headers: { meh: 'nah' },
    });
  }

  async cleanup() {
    if (!this.channel || !this.connection) {
      return;
    }

    await this.channel.close();
    await this.connection.close();
  }
}
