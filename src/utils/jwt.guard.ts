import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    console.log('AuthGuard Error:', err);
    console.log('AuthGuard User:', user);
    console.log('AuthGuard Info:', info);

    if (err || info instanceof TokenExpiredError) {
      console.error('Unauthorized: Token expired or error encountered', err || info);
      throw new UnauthorizedException(info?.message || 'Authentication error');
    }
    
    if (!user) {
      console.error('Unauthorized: User not found');
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
