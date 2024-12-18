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
import { JwtAuthGuard } from './jwt-auth.guard';

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
      console.log('Auth callback error:', error);
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
      console.log('Auth Controller - req.user:', req.user);

      // JWTトークンをクッキーに設定
      res.cookie('token', access_token, {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'dev',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Discordアクセストークンをクッキーに設定
      res.cookie('discord_token', req.user.accessToken, {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'dev',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Discord IDをクッキーに設定（httpOnly: falseで設定）
      res.cookie('discord_id', req.user.id, {
        httpOnly: false,
        secure:
          process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'dev',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      const redirectPath = redirect
        ? `/auth/callback?status=success&redirect=${encodeURIComponent(redirect)}`
        : '/auth/callback?status=success';

      res.redirect(`${process.env.FRONTEND_URL}${redirectPath}`);
    } catch (error) {
      console.error('Auth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
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
    return { userId: req.user.id };
  }

  @ApiOperation({ summary: 'Discordサーバー取得' })
  @ApiResponse({
    status: 200,
    description: 'Discordサーバー取得成功',
    type: GetUserServersResponse,
  })
  @Get('servers')
  @UseGuards(JwtAuthGuard)
  async getDiscordServers(@Request() req: RequestWithUser) {
    return this.authService.getDiscordServers(req);
  }
}
