import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService  // Injeksi PrismaService
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:8000/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, emails, photos, birthday, address } = profile;

    // Pastikan profile.email, profile.name ada
    if (!emails || !emails.length || !name) {
      throw new Error('Google profile data is missing essential information');
    }

    // Pastikan data yang digunakan untuk menyimpan ke database valid
    const user = {
      email: emails[0]?.value,  // Email harus ada
      firstName: name.givenName || '',  // Pastikan firstName ada atau string kosong
      lastName: name.familyName || '',  // Pastikan lastName ada atau string kosong
      imageUrl: photos[0]?.value || '',  // Pastikan imageUrl ada atau string kosong
      accessToken,
      birthDate: birthday ? new Date(birthday) : null,  // Jika ada tanggal lahir
      address: address || '',  // Jika ada alamat
    };

    // Cek apakah user sudah ada di database
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      // Simpan user ke database jika belum ada
      await this.prisma.user.create({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          accessToken: user.accessToken,
          birthDate: user.birthDate,  // Simpan tanggal lahir
          address: user.address,      // Simpan alamat
        },
      });
    }

    return user;  // Kembalikan data user yang valid
  }
}
