import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthService implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
      return res.status(401).send('Unauthorized'); // Jika session tidak ada
    }
    next(); // Melanjutkan ke route berikutnya
  }
}
