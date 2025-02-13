import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import log from '../debugging/debug';

@Injectable()
export class AuthGoogleService {
  constructor(
    @InjectModel('GoogleUser') private readonly googleUserModel: Model<any>,
    private readonly jwtService: JwtService,
  ) {}

  private client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  async validateGoogleToken(code: string) {
    try {
      log("Exchanging auth code for ID token...");
      log("GOOGLE_REDIRECT_URI: ", process.env.GOOGLE_REDIRECT_URI);

      // Exchange auth code for tokens
      const { tokens } = await this.client.getToken({
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      });
      log("Received tokens: ", tokens);

      if (!tokens.id_token) {
        log("No ID token found in the response");
        throw new UnauthorizedException('Failed to get ID token');
      }

      log("Verifying Google ID token...");
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      log("ID token verification successful");

      const payload = ticket.getPayload();
      log("Token payload: ", payload);

      if (!payload) {
        log("Invalid Google token payload received");
        throw new UnauthorizedException('Invalid Google token');
      }

      // Extract user information
      const { email, picture } = payload; // 'picture' contains profile image URL
      log("User email extracted: ", email);
      log("Profile Image URL extracted: ", picture);

      let user = await this.googleUserModel.findOne({ email });

      if (!user) {
        log("User not found, creating new Google user...");
        user = new this.googleUserModel({ email, profileImage: picture });
        await user.save();
      } else if (user.profileImage !== picture) {
        // Update profile image if changed
        log("Updating profile image for existing user...");
        user.profileImage = picture;
        await user.save();
      }

      // Generate JWT token
      const jwtToken = this.jwtService.sign(
        { _id: user._id, email: user.email },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' }
      );
      log("JWT token generated successfully");

      return {
        'g-token': jwtToken,
        user: user.toObject(),
      };
    } catch (error) {
      log("Error during Google token verification: ", error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
