import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { PrismaService } from '../prisma/prisma.service';
import { DiscordAuthGuard } from '../auth/discord-auth.guard';

@Module({
  controllers: [ServersController],
  providers: [ServersService, PrismaService, DiscordAuthGuard],
})
export class ServersModule {}
