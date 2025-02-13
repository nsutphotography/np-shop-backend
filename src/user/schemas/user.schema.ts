import { Schema, Document } from 'mongoose';
import { Prop, SchemaFactory, Schema as MongooseSchema } from '@nestjs/mongoose';

@MongooseSchema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false }) // Password is optional for Google login
  password?: string;

  @Prop({ required: false, unique: true, sparse: true }) // Only for Google login
  googleId?: string;

  @Prop({ required: true }) // Name is required for all users
  name: string;

  @Prop({ required: false }) // Optional profile image
  profileImage?: string;

  @Prop({ default: 'local', enum: ['local', 'google'] }) // Auth provider type
  authProvider: 'local' | 'google';

  @Prop({ default: Date.now }) // Timestamp
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
