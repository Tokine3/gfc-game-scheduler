import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Query,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RequestWithUser } from '../types/request.types';
import { GetUserServersResponse } from './entities/server.entity';
import { logger } from 'src/utils/logger';

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
    // Discord認証へのリダイレクトは@UseGuards(AuthGuard('discord'))で自動的に処理
  }

  @ApiOperation({ summary: 'Discord認証コールバック' })
  @ApiResponse({
    status: 200,
    description: 'Discord認証成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  })
  @ApiQuery({
    name: 'code',
    type: 'string',
    description: 'Discord認証コード',
  })
  @UseGuards(AuthGuard('discord'))
  @Get('discord/callback')
  async discordAuthCallback(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Query('error') error?: string,
    @Query('redirect') redirect?: string
  ) {
    if (error) {
      logger.error('Auth callback error:', error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=auth_cancelled`
      );
    }

    try {
      const { access_token } = await this.authService.login(req.user);

      // アクセストークンがundefinedでないことを確認
      logger.log('Auth Controller - req.user:', req.user);

      // JWTトークンをクッキーに設定
      console.log('Setting cookies with token:', {
        token: access_token ? `exists ${access_token}` : 'null',
        secure: process.env.NODE_ENV === 'development',
        path: '/',
        maxAge: '24 * 60 * 60 * 1000',
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
      });

      res.cookie('token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
      });

      // Discordアクセストークンをクッキーに設定
      res.cookie('discord_token', req.user.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'development',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
      });

      // Discord IDをクッキーに設定
      res.cookie('discord_id', req.user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
      });
      // クッキーの設定後に確認
      const cookies = req.cookies;
      console.log('Cookies after setting:', {
        token: cookies.token ? 'exists' : 'null',
        discord_id: cookies.discord_id ? 'exists' : 'null',
        discord_token: cookies.discord_token ? 'exists' : 'null',
      });

      const redirectPath = redirect
        ? `/auth/callback?status=success&redirect=${encodeURIComponent(redirect)}`
        : '/auth/callback?status=success';

      console.log('NODE_ENV', process.env.NODE_ENV);
      console.log('FRONTEND_URL', process.env.FRONTEND_URL);

      res.redirect(`${process.env.FRONTEND_URL}${redirectPath}`);
    } catch (error) {
      logger.error('Auth callback error:', error);

      // レート制限エラーの場合
      if (error.message?.includes('rate limited')) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=rate_limit`
        );
      }

      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=auth_failed`
      );
    }
  }

  // ヘルパーメソッドを追加
  private createExecutionContext(req: any, res: any) {
    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any;
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
    console.log('verifyToken', req.user);
    return { userId: req.user.id };
  }

  @ApiOperation({ summary: 'Discordサーバー取得' })
  @ApiResponse({
    status: 200,
    description: 'Discordサーバー取得成功',
    type: GetUserServersResponse,
  })
  @Get('servers')
  @UseGuards(AuthGuard('jwt'))
  async getDiscordServers(@Request() req: RequestWithUser) {
    return this.authService.getDiscordServers(req);
  }
}
