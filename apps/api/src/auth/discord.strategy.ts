import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get('DISCORD_CLIENT_ID'),
      clientSecret: configService.get('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.get('DISCORD_CALLBACK_URL'),
      scope: ['identify', 'guilds', 'guilds.members.read'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('accessToken', accessToken);
    const { id, username, avatar } = profile;
    const guilds = profile.guilds || [];
    console.log('profile', profile);
    console.log('guilds', guilds);
    guilds.map((g) => {
      console.log('feattures', g.features);
    });

    // 特定のサーバーIDを確認
    const targetGuildId = this.configService.get('DISCORD_GUILD_ID');
    console.log('targetGuildId', targetGuildId);
    const isMemberOfGuild = guilds.some((guild) => guild.id === targetGuildId);
    console.log('isMemberOfGuild', isMemberOfGuild);

    // ギルドメンバー情報を取得
    const response = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${targetGuildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'user-id': id,
        },
      }
    );
    const memberData = await response.json();

    // ユーザーのロール情報をログ出力
    console.log('User Roles:', memberData);

    if (!isMemberOfGuild) {
      throw new Error(
        'Unauthorized: User is not a member of the required guild'
      );
    }

    return this.authService.validateUser({
      discordId: id,
      name: username,
      avatar: avatar,
    });
  }
}
