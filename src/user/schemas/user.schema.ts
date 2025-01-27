import { Schema, Document } from 'mongoose';
import { Prop, SchemaFactory, Schema as MongooseSchema } from '@nestjs/mongoose';

// Define the User schema class
@MongooseSchema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

// Mongoose schema
export const UserSchema = SchemaFactory.createForClass(User);
