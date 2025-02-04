import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthGoogleService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(private jwtService: JwtService) {}

  async validateGoogleToken(token: string) {
    try {
      // Verify Google token
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Invalid Google token');

      // Extract user details
      const { email, name, picture, sub } = payload;

      // Here, check if the user exists in the database
      // If not, create a new user entry
      // (Assume we have a `UserService` to handle database operations)

      const user = { id: sub, email, name, picture }; // Mock user data

      // Generate JWT token
      const jwtToken = this.jwtService.sign({ id: user.id, email: user.email });

      return { user, token: jwtToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
