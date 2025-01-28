import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google/google.strategy';
import { GoogleService } from './google/google.service';
import { PrismaService } from '../prisma/prisma.service';  // Import PrismaService

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleService,
    GoogleStrategy,
    PrismaService,  // Tambahkan PrismaService ke dalam providers
  ],
})
export class AuthModule {}
