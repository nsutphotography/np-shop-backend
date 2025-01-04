import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PassportLoggerMiddleware } from './utils/middlewares/passport-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();
  app.use(new PassportLoggerMiddleware().use);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
