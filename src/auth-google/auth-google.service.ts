import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import log from '../debugging/debug';

@Injectable()
export class AuthGoogleService {
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

      log("ID token successfully received: ", tokens.id_token);

      // Verify ID token
      log("Verifying Google ID token...");
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      log("ID token verification successful");

      const payload = ticket.getPayload();
      log("Token payload: ", payload);
      console.log("Token payload: ", payload);

      if (!payload) {
        log("Invalid Google token payload received");
        throw new UnauthorizedException('Invalid Google token');
      }

      // Extract user information
      const { email, sub } = payload;
      log("User email extracted from token payload: ", email);

      // Generate JWT token
      const jwtToken = jwt.sign(
        { email, sub },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Set expiration as needed
      );
      log("JWT token generated successfully");

      return { email, token: jwtToken };
    } catch (error) {
      log("Error during Google token verification: ", error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
