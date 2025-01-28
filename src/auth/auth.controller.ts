import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google')) // Guard untuk Google OAuth
  googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google')) // Proses otentikasi Google
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    req.session.user = req.user; // Menyimpan data user di session
    
    // Redirect ke /home di port 3000 setelah login berhasil
    res.redirect('http://localhost:3000/home');
  }

  @Get('profile')
  getProfile(@Req() req) {
    if (!req.session.user) {
      return 'You are not logged in!';
    }
    return req.session.user; // Menampilkan data user dari session
  }

  @Get('logout')
  logout(@Req() req, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to log out');
      }
      res.clearCookie('connect.sid'); // Menghapus session cookie
      res.redirect('http://localhost:3000'); // Redirect ke halaman utama di frontend
    });
  }
}
