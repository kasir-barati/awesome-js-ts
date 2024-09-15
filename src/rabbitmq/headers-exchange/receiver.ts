import { Channel, connect, Connection } from 'amqplib';

export class Receiver {
  private connection?: Connection;
  private channel?: Channel;

  async init() {
    this.connection = await connect(process.env.RABBITMQ_URI);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange('amq.headers', 'headers');
    await this.channel.assertQueue('some.queue');
    await this.channel.assertQueue('another.queue');

    await this.channel.bindQueue('some.queue', 'amq.headers', '', {
      'x-match': 'any',
      'driver-verification-req': 'some.queue',
    });
    await this.channel.bindQueue('another.queue', 'amq.headers', '', {
      'x-match': 'any',
      'audit-log': 'log',
    });

    await this.channel.consume(
      'some.queue',
      (message) => {
        console.log('Message for "some.queue"');
        console.log(message?.content?.toString());
      },
      { noAck: true },
    );
    await this.channel.consume(
      'another.queue',
      (message) => {
        console.log('Message for "another.queue"');
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
