import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, SchemaTypes } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId; // Reference to User model

  @Prop({ 
    required: process.env.NODE_ENV === 'development' // Only required in development mode
  })
  email?: string;

  @Prop({
    required: true,
    type: [{ productId: SchemaTypes.ObjectId, quantity: Number }]
  })
  items: { productId: MongooseSchema.Types.ObjectId; quantity: number }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], index: true })
  status: string;

  @Prop()
  paymentId?: string;

  @Prop()
  shippingAddress?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
