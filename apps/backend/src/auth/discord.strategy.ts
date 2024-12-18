import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { logger } from 'src/utils/logger';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get('DISCORD_CLIENT_ID'),
      clientSecret: configService.get('DISCORD_CLIENT_SECRET'),
      callbackURL:
        configService.get('DISCORD_CALLBACK_URL') ||
        `${configService.get('API_URL')}/auth/discord/callback`,
      scope: ['identify', 'guilds', 'guilds.members.read'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      logger.log('Discord Strategy - accessToken:', accessToken);
      const { id, global_name, username, avatar } = profile;
      console.log('Discord Strategy - profile:', profile);
      const user = await this.authService.validateUser({
        id,
        name: global_name || username,
        avatar,
      });

      return {
        ...user,
        accessToken,
      };
    } catch (error) {
      if (error.message?.includes('rate limited')) {
        logger.log('Rate limit hit, waiting before retry...');
        // 5秒待機してリトライ
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return this.validate(accessToken, refreshToken, profile);
      }
      throw error;
    }
  }
}
