import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';

@Module({
  providers: [GoogleService],
  exports: [GoogleService], // Ekspor untuk digunakan di tempat lain
})
export class GoogleServiceModule {}
