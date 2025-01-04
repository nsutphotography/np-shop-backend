import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PassportLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request URL form middleware:', req.url);
    console.log('Authorization Header form middleware:', req.headers.authorization);
    next(); // Proceed to the next middleware (Passport)
  }
}
