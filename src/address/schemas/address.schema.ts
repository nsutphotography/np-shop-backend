import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as dotenv from 'dotenv';
import debugLib from 'debug'
const log = debugLib('app:address schema')

// Load environment variables
dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';
log("node env development or not",isDevelopment)

@Schema({ timestamps: true })
export class Address extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ default: false })
  isDefault: boolean;

  // Conditionally add the userEmail field in development mode
  @Prop(isDevelopment ? { required: false } : undefined)
  userEmail?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

// Remove userEmail field in production
if (!isDevelopment) {
  AddressSchema.remove('userEmail');
}
