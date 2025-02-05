import { Controller, Post, Body,Get, Query } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import log from 'src/debugging/debug';

@Controller('auth')
export class AuthGoogleController {
  constructor(private readonly authService: AuthGoogleService) {}

  @Post('google')
  async googleLogin(@Body('code') code: string) {
    log("Received Google login request with auth code", code);
    return this.authService.validateGoogleToken(code);
  }
    
  @Get('google/callback')
  async googleCallback(@Query('code') code: string) {
    log("Received Google callback with auth code", code);
    return this.authService.validateGoogleToken(code);
  }
}
