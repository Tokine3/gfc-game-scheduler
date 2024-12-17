import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/request.types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Discordログイン開始' })
  @ApiResponse({
    status: 302,
    description: 'Discordの認証ページにリダイレクト',
  })
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Discord認証へのリダイレクトは@UseGuards(AuthGuard('discord'))で自動的に処理されます
  }

  @ApiOperation({ summary: 'Discord認証コールバック' })
  @ApiResponse({
    status: 302,
    description: '認証成功時にフロントエンドにリダイレクト',
  })
  @ApiResponse({
    status: 401,
    description: 'Discord認証失敗',
  })
  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const { access_token } = await this.authService.login(req.user);

      // Discord IDをクッキーに設定
      res.cookie('X-Discord-ID', req.user.id, {
        httpOnly: false, // JavaScriptからアクセス可能に
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/', // パスを明示的に指定
      });

      // JWTトークンをクッキーに設定
      res.cookie('token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.FRONTEND_URL}/home`);
    } catch (error) {
      console.error('Auth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }
  }

  @ApiOperation({ summary: 'JWTトークンの検証' })
  @ApiCookieAuth('token')
  @ApiResponse({
    status: 200,
    description: 'トークンが有効',
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'Discord User ID',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: '無効なトークン' })
  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  async verifyToken(@Req() req: any) {
    return { userId: req.user.id };
  }
}
