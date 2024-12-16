import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Discord認証へのリダイレクトは@UseGuards(AuthGuard('discord'))で自動的に処理されます
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const { access_token } = await this.authService.login(req.user);

      // JWTトークンをクッキーに設定
      res.cookie('token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24時間
      });

      // フームページにリダイレクト
      res.redirect(`${process.env.FRONTEND_URL}/home`);
    } catch (error) {
      console.error('Auth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  async verifyToken(@Req() req: any) {
    return { userId: req.user.id };
  }
}
