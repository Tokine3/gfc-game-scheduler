import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscordAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const discordId = request.headers['x-discord-id'];
    const discordToken = request.headers['x-discord-token'];

    if (!discordId || !discordToken) {
      throw new UnauthorizedException('Discord credentials not provided');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: String(discordId) },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // リクエストにユーザー情報とトークンを添付
    request.user = {
      ...user,
      accessToken: discordToken,
    };

    return true;
  }
}
