import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema'; // Adjust path based on your project structure
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload in Strategy:', payload); // Log the payload
    console.log('Querying DB with user ID:', payload._id); // Log the _id being used for DB query
  
    const user = await this.userModel.findById(payload._id); // Check if this ID exists in the DB
    console.log('User Retrieved from DB:', user); // Log the user found or null
  
    if (!user) {
      console.error('Unauthorized: User not found'); // Log if the user is not found
      throw new Error('Unauthorized');
    }
  
    return { userId: user._id, email: user.email }; // Return user data if found
  }
  
  
}
