import { Controller, Post, Body } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import log from 'src/debugging/debug';

@Controller('auth')
export class AuthGoogleController {
  constructor(private readonly authService: AuthGoogleService) {}

  @Post('google')
  async googleLogin(@Body('token') token: string) {
    log("a");
    return this.authService.validateGoogleToken(token);
  }
}
