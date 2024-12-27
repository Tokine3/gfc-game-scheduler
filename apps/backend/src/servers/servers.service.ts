import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestWithUser } from 'src/types/request.types';
import { JoinServerDto } from './dto/join-server.dto';
import { logger } from 'src/utils/logger';
import { AddFavServerDto } from './dto/addFav-server-dto';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) {}

  async join(req: RequestWithUser, joinServerDto: JoinServerDto) {
    logger.log('joinServerDto', joinServerDto);
    const { serverId, serverName, serverIcon } = joinServerDto;
    console.log('req', req.user);
    // サーバーが既に存在するか確認
    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });
    if (server) {
      // サーバーが既に存在する場合はサーバーユーザーを作成
      return await this.prisma.serverUser.upsert({
        where: {
          userId_serverId: {
            userId: req.user.id,
            serverId: serverId,
          },
        },
        update: {
          isJoined: true,
        },
        create: {
          userId: req.user.id,
          serverId,
          isJoined: true,
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
            isJoined: true,
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

  async addFavorite(
    serverId: string,
    addFavServerDto: AddFavServerDto,
    req: RequestWithUser
  ) {
    console.log('addFavorite', serverId, addFavServerDto);
    const { isFavorite, serversList } = addFavServerDto;
    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });

    // DB上にサーバのデータが無いとき
    if (!server) {
      const server = serversList.find((server) => server.id === serverId);
      // サーバに所属しているか確認
      if (!server) {
        throw new NotFoundException('サーバが見つかりません');
      }
      // サーバを作成　同時にサーバユーザの作成とお気に入りの処理を行う
      await this.prisma.server.create({
        data: {
          id: serverId,
          name: server.name,
          icon: server.icon,
          serverUsers: {
            create: {
              userId: req.user.id,
              isFavorite,
            },
          },
        },
      });
      // サーバユーザを取得してReturn
      const serverUser = await this.prisma.serverUser.findUnique({
        where: {
          userId_serverId: {
            userId: req.user.id,
            serverId: serverId,
          },
        },
      });
      return serverUser;
    }

    // DB上にサーバのデータがあるとき、サーバユーザのお気に入りの処理を行う
    try {
      const serverUser = await this.prisma.serverUser.upsert({
        where: {
          userId_serverId: {
            userId: req.user.id,
            serverId: serverId,
          },
        },
        update: {
          isFavorite: isFavorite,
          updatedAt: new Date(),
        },
        create: {
          userId: req.user.id,
          serverId: serverId,
          isFavorite: isFavorite,
        },
      });

      return serverUser;
    } catch (error) {
      console.error('Error in addFavorite:', error);
      throw new InternalServerErrorException(
        'Failed to update favorite status'
      );
    }
  }
}
