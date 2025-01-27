import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log('AuthGuard Error:', err); // Log any errors
    console.log('AuthGuard User:', user); // Log the user object
    console.log('AuthGuard Info:', info); // Log the additional info from Passport

    if (err || !user) {
      console.error('Unauthorized: Error or user not found');
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
