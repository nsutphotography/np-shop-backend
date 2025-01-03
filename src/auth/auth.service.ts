// src/auth/auth.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './schemas/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    // Check if the user already exists
    const existingUser = await this.adminModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists form backdend');
    }
  
    // Hash the password and save the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new this.adminModel({ email, password: hashedPassword });
    return admin.save();
  }
  

  async login(email: string, password: string) {
    const admin = await this.adminModel.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ id: admin._id });
    return { token };
  }
}
