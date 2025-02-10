import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PassportLoggerMiddleware } from './utils/middlewares/passport-logger.middleware';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import debugLib from 'debug'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
const log = debugLib('app:main')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the ConfigService
  dotenv.config(); // Load .env file
  const configService = app.get(ConfigService);

  // Enable CORS
  const allowedOrigins: string[] = [
    // 'http://localhost:8084',
    // 'https://staging.your-domain.com',
    // 'https://your-domain.com'
    process.env.LOCAL_ORIGINS,
    process.env.VERCLE_FINAL_ORIGINS,
    process.env.NETLIFY_FINAL_ORIGINS,
    process.env.RANDOM_ORIGINS,
    process.env.VERCLE_ORIGINS
  ];

  // Configure CORS options
  const corsOptions: CorsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Include PATCH
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow cookies/auth headers
  };

  // Enable CORS with the chosen options
  app.enableCors(corsOptions);
  log(allowedOrigins)
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
