import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestWithUser } from '../types/request.types';
import { GetUserServersResponse } from './entities/server.entity';
import { logger } from 'src/utils/logger';
import { DiscordAuthGuard } from './discord-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

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
  })
  @UseGuards(AuthGuard('discord'))
  @Get('discord/callback')
  async discordAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const firebaseToken = await this.authService.createFirebaseToken(
        req.user
      );
      const discordToken = req.user.accessToken;

      if (!discordToken) {
        throw new Error('Discord token not provided');
      }

      const redirectUrl = new URL('/auth/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.set('status', 'success');
      redirectUrl.searchParams.set('firebaseToken', firebaseToken);
      redirectUrl.searchParams.set('discordId', req.user.id);
      redirectUrl.searchParams.set('discordToken', discordToken);

      logger.log('Auth callback tokens:', {
        discordId: req.user.id,
        hasDiscordToken: !!discordToken,
        discordTokenPrefix: discordToken?.substring(0, 10),
      });

      res.redirect(redirectUrl.toString());
    } catch (error) {
      logger.error('Auth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
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
      return this.authService.getDiscordServers(req);
    } catch (error) {
      logger.error('Get servers error:', error);
      throw error;
    }
  }
}
