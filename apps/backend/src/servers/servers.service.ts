import { Injectable } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RequestWithUser } from 'src/types/request.types';
import { JoinServerDto } from './dto/join-server.dto';
import { logger } from 'src/utils/logger';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) {}

  async join(req: RequestWithUser, joinServerDto: JoinServerDto) {
    logger.log('joinServerDto', joinServerDto);
    const { serverId, serverName, serverIcon } = joinServerDto;
    // サーバーが既に存在するか確認
    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });
    if (server) {
      // サーバーが既に存在する場合はサーバーユーザーを作成
      return await this.prisma.serverUser.create({
        data: {
          userId: req.user.id,
          serverId,
        },
      });
    }
    // サーバーが存在しない場合はサーバーを作成
    return this.prisma.server.create({
      data: {
        id: serverId,
        name: serverName,
        icon: serverIcon,
        serverUsers: {
          create: {
            userId: req.user.id,
          },
        },
      },
    });
  }

  async findMeServerUser(req: RequestWithUser, serverId: string) {
    const serverUser = await this.prisma.serverUser.findFirst({
      where: {
        userId: req.user.id,
        serverId: serverId,
      },
    });
    return !!serverUser;
  }

  findAll() {
    return `This action returns all servers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} server`;
  }

  update(id: number, updateServerDto: UpdateServerDto) {
    return `This action updates a #${id} server`;
  }

  remove(id: number) {
    return `This action removes a #${id} server`;
  }
}
