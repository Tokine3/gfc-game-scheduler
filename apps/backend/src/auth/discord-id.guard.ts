import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { logger } from 'src/utils/logger';

@Injectable()
export class DiscordIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    logger.log('DiscordIdGuard - canActivate');
    const request = context.switchToHttp().getRequest();
    const discordId = request.headers['discord-id'];

    if (!discordId) {
      return false;
    }

    request.discordId = discordId;
    return true;
  }
}
