import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as dotenv from 'dotenv';
import debugLib from 'debug';
const log = debugLib('app:address:schema');

// Load environment variables
dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';
log('node env development or not', isDevelopment);

@Schema()
export class Address extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to User model
  userId: Types.ObjectId;

  @Prop({ type: String, required: false }) // Include user email optionally
  userEmail?: string;

  @Prop([
    {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
      isDefault: { type: Boolean, default: false }, // Indicates if this is the default address
      label: {type: String,},
    },
  ])
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault?: boolean;
    label: string;
  }>;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

// Remove userEmail field in production
if (!isDevelopment) {
  AddressSchema.remove('userEmail');
}
