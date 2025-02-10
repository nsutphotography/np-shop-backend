import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import log from '../debugging/debug'
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    log(email)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashedPassword });
    await user.save();
    return { message: 'User registered successfully' };
  }

async login(email: string, password: string) {
  console.log('Login Attempt:', { email, password }); // Log input data
  
  const user = await this.userModel.findOne({ email });
  console.log('User Found in DB:', user); // Log the user object or null
  
  if (!user) {
    console.error('Unauthorized: Invalid email'); // Log failure reason
    throw new UnauthorizedException('Invalid credentials');
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log('Password Valid:', isPasswordValid); // Log password validation result
  
  if (!isPasswordValid) {
    console.error('Unauthorized: Invalid password'); // Log failure reason
    throw new UnauthorizedException('Invalid credentials');
  }
  
  const payload = { _id: user._id, email: user.email };
  const token = this.jwtService.sign(payload);
  console.log('JWT Token Generated:', token); // Log generated token

  // Convert user document to an object and remove the password field
  const { password: _, ...userWithoutPassword } = user.toObject();
  // console.log("user data sending to the frontend",userWithoutPassword)
  log("user data sending to the frontend",userWithoutPassword)

  return { 
    token, 
    user: userWithoutPassword
  };
}



async getProfile(userId: string) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return {
    email: user.email,
    // You can add more user details here as needed
  };
}

}
