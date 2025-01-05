
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Updated to reference the User model
  userId: Types.ObjectId; // Use ObjectId for the userId

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true }, // ObjectId type for productId
      quantity: { type: Number, required: true, min: 1 }, // Quantity must be at least 1
    },
  ])
  items: Array<{ productId: Types.ObjectId; quantity: number }>; // Array of product references and their quantities
}

export const CartSchema = SchemaFactory.createForClass(Cart);
