import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Query,
  Request,
  UnauthorizedException,
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
import axios from 'axios';
import * as admin from 'firebase-admin';
import { PrismaService } from '../prisma/prisma.service';
import { DiscordAuthGuard } from './discord-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService
  ) {}

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
  async discordAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      // Discord認証からアクセストークンを取得
      const discordToken = req.user.accessToken; // DiscordStrategyから渡されるアクセストークン
      const firebaseToken = await this.createFirebaseToken(req.user);

      // URLパラメータとしてトークンを渡す
      const redirectUrl = new URL('/auth/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.set('status', 'success');
      redirectUrl.searchParams.set('firebaseToken', firebaseToken);
      redirectUrl.searchParams.set('discordId', req.user.id);
      redirectUrl.searchParams.set('discordToken', discordToken); // JWTではなくDiscordのアクセストークン

      res.redirect(redirectUrl.toString());
    } catch (error) {
      logger.error('Auth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }

  private async getDiscordAccessToken(code: string): Promise<string> {
    const response = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_CALLBACK_URL,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    return response.data.access_token;
  }

  private async createFirebaseToken(user: any): Promise<string> {
    try {
      const uid = String(user.id);
      console.log('Creating Firebase token for user:', { uid });

      // シスタムクレームを最小限に
      const customClaims = {
        provider: 'discord',
        name: user.name,
      };

      const token = await admin.auth().createCustomToken(uid, customClaims);
      console.log('Firebase token created:', {
        uid,
        hasToken: !!token,
        projectId: admin.app().options.projectId,
      });

      return token;
    } catch (error) {
      console.error('Firebase token creation error:', error);
      throw error;
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
  async verifyToken(@Req() req: RequestWithUser) {
    return { userId: req.user.id };
  }

  @ApiOperation({ summary: 'Discordサーバー取得' })
  @ApiResponse({
    status: 200,
    description: 'Discordサーバー取得成功',
    type: GetUserServersResponse,
  })
  @Get('servers')
  @UseGuards(DiscordAuthGuard)
  async getDiscordServers(@Req() req: RequestWithUser) {
    try {
      console.log('Getting servers for user:', req.user.id);
      return this.authService.getDiscordServers(req);
    } catch (error) {
      console.error('Get servers error:', error);
      throw error;
    }
  }
}
