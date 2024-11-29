import { HydratedDocument, model, Schema } from 'mongoose';

export enum Sender {
  user = 'user',
  openai = 'openai',
}

interface MessageDocument {
  message: string;
  sender: Sender;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    message: String,
    sender: { type: String, enum: Object.values(Sender) },
  },
  { timestamps: true },
);

export type HydratedMessageDocument =
  HydratedDocument<MessageDocument>;
export const Message = model('Message', MessageSchema);
