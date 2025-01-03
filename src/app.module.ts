// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,

    // ProductsModule,
    AuthModule,
  ],
})
export class AppModule { }
