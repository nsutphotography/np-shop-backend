import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
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
      log("GOOGLE_CLIENT_ID: ", process.env.GOOGLE_CLIENT_ID);
      log("GOOGLE_REDIRECT_URI: ", process.env.GOOGLE_REDIRECT_URI);

      // Exchange auth code for tokens
      const { tokens } = await this.client.getToken({
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI, // Explicitly set it

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

      if (!payload) {
        log("Invalid Google token payload received");
        throw new UnauthorizedException('Invalid Google token');
      }

      // Extract email
      const { email } = payload;
      log("User  email extracted from token payload: ", email);

      return { email };
    } catch (error) {
      log("Error during Google token verification: ", error);
      if (error instanceof UnauthorizedException) {
        log("Unauthorized exception: ", error.message);
      } else {
        log("Unexpected error: ", error.message);
      }
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}