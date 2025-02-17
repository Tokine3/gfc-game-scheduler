import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtPayload } from '../types/jwt.types';
import { GetUserServersResponse } from './entities/server.entity';
import { getUserDiscordServer } from 'utils/getDiscordServer';
import { RequestWithUser } from 'src/types/request.types';
import { logger } from 'src/utils/logger';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(discordUser: AuthUserDto) {
    const { id, name, avatar, accessToken } = discordUser;

    logger.log('user', discordUser);

    let user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id,
          name,
          avatar,
          lastLoggedInAt: new Date(),
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          avatar,
          lastLoggedInAt: new Date(),
        },
      });
    }

    return {
      ...user,
      accessToken,
    };
  }

  async login(user: any) {
    const payload: JwtPayload = { sub: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getDiscordServers(
    req: RequestWithUser
  ): Promise<GetUserServersResponse> {
    logger.log('getDiscordServers');
    try {
      const guilds = await getUserDiscordServer(req);

      // レート制限チェックを追加
      if ('retry_after' in guilds) {
        logger.log('Rate limited, waiting...', guilds.retry_after);
        // レート制限時は少し待ってから再試行
        await new Promise((resolve) =>
          setTimeout(resolve, guilds.retry_after * 1000 + 100)
        );
        return this.getDiscordServers(req); // 再帰的に再試行
      }

      // guildsの型チェックとデバッグログ
      logger.log('Fetched guilds:', guilds);
      if (!Array.isArray(guilds)) {
        logger.error('Guilds is not an array:', guilds);
        return {
          data: [],
          calendarCount: 0,
        };
      }

      const guildIds = guilds.map((guild) => guild.id);
      logger.log('Guild IDs:', guildIds);

      const serversWithCalendars = await this.prisma.server.findMany({
        where: { id: { in: guildIds } },
        include: {
          calendars: true,
          serverUsers: { where: { userId: req.user.id } },
        },
      });

      const data = guilds.map((guild) => {
        const serverData = serversWithCalendars.find((s) => s.id === guild.id);
        return {
          id: guild.id,
          name: guild.name,
          icon: guild.icon ? guild.icon : null,
          calendars: serverData?.calendars || [],
          serverUsers: serverData?.serverUsers || [],
        };
      });

      return {
        data,
        calendarCount: serversWithCalendars.reduce(
          (acc, server) => acc + server.calendars.length,
          0
        ),
      };
    } catch (error) {
      logger.error('Error in getDiscordServers:', error);
      return {
        data: [],
        calendarCount: 0,
      };
    }
  }

  async createFirebaseToken(user: any): Promise<string> {
    try {
      const uid = String(user.id);
      const customClaims = {
        provider: 'discord',
        name: user.name,
      };

      return await admin.auth().createCustomToken(uid, customClaims);
    } catch (error) {
      logger.error('Firebase token creation error:', error);
      throw error;
    }
  }
}
