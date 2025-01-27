import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PassportLoggerMiddleware } from './utils/middlewares/passport-logger.middleware';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import debugLib from 'debug'
const log = debugLib('app:main')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the ConfigService
  dotenv.config(); // Load .env file
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors();

  // Use your custom middleware
  app.use(new PassportLoggerMiddleware().use);

  // Use the PORT environment variable or default to 3000
  const port = configService.get<number>('PORT') ?? 3000;
// log('NODE_ENV:', process.env.NODE_ENV);

  await app.listen(port, () => {
log(`Application is running on port ${port}`);
  });
}
bootstrap();
