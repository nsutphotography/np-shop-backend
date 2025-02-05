// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { StripeModule } from './stripe/stripe.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes it globally accessible
    }),
    StripeModule,
    DatabaseModule,

    ProductsModule,
    // AuthModule,
    CartModule,
    UserModule,
    AddressModule,
    AuthGoogleModule,
  ],
})
export class AppModule { }
