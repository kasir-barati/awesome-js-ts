import { Message, Sender } from './message.model';

export class MessageRepository {
  async create({
    message,
    sender,
  }: {
    message: string;
    sender: Sender;
  }) {
    const messageDocument = await new Message({
      message,
      sender,
    }).save();

    return messageDocument.toObject();
  }
}
