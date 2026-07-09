import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

export const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['new', 'processed', 'processing'],
      required: true,
      default: 'new',
    },
    processedAt: { type: Date },
  },
  { collection: 'orders', timestamps: true },
);

export type Order = InferSchemaType<typeof OrderSchema>;
export type OrderDoc = HydratedDocument<Order>;

export const OrderModel = model<Order>('Order', OrderSchema);
