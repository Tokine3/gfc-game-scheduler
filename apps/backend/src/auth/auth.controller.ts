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
      // 認証ガードのインスタンスを作成して実行
      const guard = new (AuthGuard('discord'))();
      await guard.canActivate(this.createExecutionContext(req, res));

      const { access_token } = await this.authService.login(req.user);

      // アクセストークンがundefinedでないことを確認
      logger.log('Auth Controller - req.user:', req.user);

      // JWTトークンをクッキーに設定
      console.log('Setting cookies with token:', {
        token: access_token ? 'exists' : 'null',
        secure: true,
        sameSite: 'lax',
      });

      res.cookie('token', access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        domain: new URL(process.env.FRONTEND_URL || '').hostname,
      });

      // Discordアクセストークンをクッキーに設定
      res.cookie('discord_token', req.user.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        domain: new URL(process.env.FRONTEND_URL || '').hostname,
      });

      // Discord IDをクッキーに設定
      res.cookie('discord_id', req.user.id, {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        domain: new URL(process.env.FRONTEND_URL || '').hostname,
      });

      const redirectPath = redirect
        ? `/auth/callback?status=success&redirect=${encodeURIComponent(redirect)}`
        : '/auth/callback?status=success';

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
