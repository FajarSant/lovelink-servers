import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Global konfigurasi
    }),
    AuthModule,  // Modul otentikasi
  ],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Menggunakan cookie-parser dan session middleware
    consumer
      .apply(cookieParser()) 
      .forRoutes('*'); // Aktifkan untuk semua rute

    consumer
      .apply(
        session({
          secret: this.configService.get<string>('SESSION_SECRET'),  // Secret untuk session
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false,  // Jangan gunakan secure=true selama pengembangan lokal tanpa HTTPS
            httpOnly: true, 
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 hari
          },
        }),
      )
      .forRoutes('*'); // Aktifkan untuk semua rute
  }
}
