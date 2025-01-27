import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

import * as dotenv from 'dotenv';
dotenv.config(); // Load .env file

import debugLib from 'debug'
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const log = debugLib('app:cart schema')
const isDevelopment = process.env.NODE_ENV === 'development'; // Check the environment
log("NODE_ENV value",process.env.NODE_ENV)
// log("node env development or not",isDevelopment)
@Schema()
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference the User model
  userId: Types.ObjectId;

  @Prop({ type: String, required: false }) // Include the user's email only in development
  userEmail?: string;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true }, // ObjectId type for productId
      quantity: { type: Number, required: true, min: 1 }, // Quantity must be at least 1
    },
  ])
  items: Array<{ productId: Types.ObjectId; quantity: number }>; // Array of product references and their quantities
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Conditionally remove the userEmail field in production
if (!isDevelopment) {
  log("Conditionally remove the userEmail field in production")
  CartSchema.remove('userEmail');
}
