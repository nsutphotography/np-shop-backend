import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleUser, GoogleUserSchema } from './schemas/google-user.schema'; // Import schema

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }, // Increased expiry to match the service
    }),
    MongooseModule.forFeature([{ name: 'GoogleUser', schema: GoogleUserSchema }]), // Register GoogleUser schema
  ],
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService],
  exports: [AuthGoogleService], // Export service if needed in other modules
})
export class AuthGoogleModule {}
