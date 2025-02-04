import { Controller, Post, Body } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';

@Controller('auth')
export class AuthGoogleController {
  constructor(private readonly authService: AuthGoogleService) {}

  @Post('google')
  async googleLogin(@Body('token') token: string) {
    return this.authService.validateGoogleToken(token);
  }
}
