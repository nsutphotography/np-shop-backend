import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import log from '../debugging/debug';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    private readonly jwtService: JwtService,
  ) {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // **Signup with email & password**
  async signUp(email: string, password: string) {
    log('Sign Up Request received with email:', email);

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashedPassword, authProvider: 'local' });
    await user.save();

    return { message: 'User registered successfully' };
  }

  // **Login with email & password**
  async login(email: string, password: string) {
    log('Login Request received with email:', email);

    const user = await this.userModel.findOne({ email });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { _id: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user.toObject();
    log('User data sending to the frontend:', userWithoutPassword);

    return { token, user: userWithoutPassword };
  }

  // **Google OAuth Login**
  async validateGoogleToken(code: string) {
    try {
      log('Exchanging auth code for ID token...');
      log('GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI);

      // Exchange auth code for tokens
      const { tokens } = await this.client.getToken({ code, redirect_uri: process.env.GOOGLE_REDIRECT_URI });
      log('Received tokens:', tokens);

      if (!tokens.id_token) {
        throw new UnauthorizedException('Failed to get ID token');
      }

      log('Verifying Google ID token...');
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const { email, picture, name, sub: googleId } = payload;
      log('User info from Google:', { email, picture, name });

      let user = await this.userModel.findOne({ email });

      if (!user) {
        log('User not found, creating new Google user...');
        user = new this.userModel({ email, googleId, profileImage: picture, name, authProvider: 'google' });
        await user.save();
      } else if (user.authProvider === 'local') {
        throw new UnauthorizedException('Email already registered with password login');
      } else if (user.profileImage !== picture) {
        log('Updating profile image for existing user...');
        user.profileImage = picture;
        await user.save();
      }

      const token = this.jwtService.sign({ _id: user._id, email: user.email }, { expiresIn: '15m' });
      log('JWT token generated successfully');

      return { token: token, user: user.toObject() };
    } catch (error) {
      log('Error during Google token verification:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  // **Get User Profile**
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { user };
  }

    async validateUser(email: string, password: string): Promise<any> {
      // Example: Find user in database
      const user = await this.findUserByEmail(email);
      if (user && user.password === password) {
        return user;
      }
      return null;
    }
  
    private async findUserByEmail(email: string) {
      // Replace with actual DB lookup logic
      return { id: 1, email: email, password: 'hashedPassword' };
    }
}
