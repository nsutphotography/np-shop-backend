import { Schema, Document } from 'mongoose';
import { Prop, SchemaFactory, Schema as MongooseSchema } from '@nestjs/mongoose';

@MongooseSchema()
export class GoogleUser extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  profileImage: string; // New field to store profile image URL
}

export const GoogleUserSchema = SchemaFactory.createForClass(GoogleUser);
