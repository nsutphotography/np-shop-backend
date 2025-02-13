import { Controller, Post, Body, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/utils/jwt.guard';
import log from '../debugging/debug';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // **Signup with email & password**
  @Post('signup')
  async signUp(@Body('email') email: string, @Body('password') password: string) {
    log('Sign Up Request received with email: %s', email);
    return this.authService.signUp(email, password);
  }

  // **Login with email & password**
  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    log('Login Request received with email: %s', email);
    return this.authService.login(email, password);
  }

  // **Google OAuth Callback (Redirect)**
  // @Get('google/callback')
  // googleRedirect(@Query('code') code: string, @Res() res: Response) {
  //   log('Received Google callback with code:', code);
  //   return res.redirect(`http://localhost:5173?code=${code}`);
  // }

  // // **Google OAuth Callback (Handle Auth Code)**
  @Post('google')
  async googleLogin(@Body('code') code: string) {
    log('Received Google login request with auth code', code);
    return this.authService.validateGoogleToken(code);
  }

  // // **Protected Profile Route**
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // async getProfile(@Req() req: Request) {
  //   log('User ID in Profile:', req['userId']);
  //   return this.authService.getProfile(req['userId']);
  // }
}
