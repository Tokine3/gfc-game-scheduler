import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RequestWithUser } from 'src/types/request.types';
import { JoinServerDto } from './dto/join-server.dto';
import { logger } from 'src/utils/logger';
import { AddFavServerDto } from './dto/addFav-server-dto';
import { User } from 'src/user/entities/user.entity';
import { getUserDiscordServer } from 'src/utils/getDiscordServer';

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

  findAll() {
    return `This action returns all servers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} server`;
  }

  async addFavorite(
    serverId: string,
    addFavServerDto: AddFavServerDto,
    req: RequestWithUser
  ) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });

    // DB上にサーバのデータが無いとき
    if (!server) {
      const guilds = await getUserDiscordServer(req);
      const server = guilds.find((guild) => guild.id === serverId);
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
              isFavorite: addFavServerDto.isFavorite,
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
          isFavorite: addFavServerDto.isFavorite,
          updatedAt: new Date(),
        },
        create: {
          userId: req.user.id,
          serverId: serverId,
          isFavorite: addFavServerDto.isFavorite,
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

  update(id: number, updateServerDto: UpdateServerDto) {
    return `This action updates a #${id} server`;
  }

  remove(id: number) {
    return `This action removes a #${id} server`;
  }
}
