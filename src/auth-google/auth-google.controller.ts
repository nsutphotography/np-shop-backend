import { Controller, Post, Body,Get, Query, Res } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import log from 'src/debugging/debug';
import { Response } from 'express'

@Controller('auth')
export class AuthGoogleController {
  constructor(private readonly authService: AuthGoogleService) {}

  // Handle Google Callback with GET
  @Get('google/callback')
  googleRedirect(@Query('code') code: string, @Res() res: Response) {
    console.log("Received Google callback with code:", code);
    
    // Redirect frontend to handle the code
    return res.redirect(`http://localhost:5173?code=${code}`);
  }

  // Handle Google Callback with POST (used in popup mode)
  @Post('google/callback')
  async googleLogin(@Body('code') code: string) {
    console.log("Received Google login request with auth code", code);
    return this.authService.validateGoogleToken(code);
  }
}