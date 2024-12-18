import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get('DISCORD_CLIENT_ID'),
      clientSecret: configService.get('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.get('DISCORD_CALLBACK_URL'),
      scope: ['identify', 'guilds'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('Discord Strategy - accessToken:', accessToken);
    const { id, username, avatar } = profile;
    const user = await this.authService.validateUser({
      id,
      name: username,
      avatar,
    });

    return {
      ...user,
      accessToken,
    };
  }
}
