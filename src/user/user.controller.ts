import { Controller, Post, Body, Get, Request, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/utils/jwt.guard';
// import debug from 'debug';
import log from '../debugging/debug'

// Set up the dbgr logger (using the namespace 'app:user-controller')
// const log = debug('app:user-controller');
log("test sing log")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  async signUp(@Body('email') email: string, @Body('password') password: string) {
    console.log("hihhihihihihihihih")
    log('Sign Up Request received with email: %s', email); // Log signup action
    return this.userService.signUp(email, password);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    log('Login Request received with email: %s', email); // Log login action
    return this.userService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(
    @Req() req: any, // Access request object to get userId from JWT
  ) {
    // Use dbgr to log the user ID in the profile request
    console.log('\x1b[33m%s\x1b[0m', 'User ID in Profile of console: 1', req.user.userId); // Log the user ID in profile
    log('User ID in Profile: 2', req.user.userId); // Log the user ID in profile
    log('\x1b[34m%s\x1b[0m','User ID in Profile: 3', req.user.userId); // Log the user ID in profile
    console.log('\x1b[33m%s\x1b[0m', 'User ID in Profile of console: 4', req.user.userId); // Log the user ID in profile
    const userId = req.user.userId; // Assuming user ID is in the request object
    return this.userService.getProfile(userId);
  }
}
