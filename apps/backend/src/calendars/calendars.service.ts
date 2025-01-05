import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { RequestWithUser } from '../types/request.types';
import { PrismaService } from '../prisma/prisma.service';
import { logger } from 'src/utils/logger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// プラグインを追加
dayjs.extend(utc);

@Injectable()
export class CalendarsService {
  constructor(private readonly prisma: PrismaService) {}
  create(req: RequestWithUser, body: CreateCalendarDto) {
    logger.log('CALENDARS SERVICE');
    logger.log(body);
    const { name, serverId } = body;
    return this.prisma.calendar.create({
      data: {
        name,
        server: {
          connect: {
            id: serverId,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all calendars`;
  }

  async findOne(
    req: RequestWithUser,
    id: string,
    fromDate?: string,
    toDate?: string
  ) {
    logger.log('fromDate', fromDate);
    logger.log('toDate', toDate);

    // イベントの取得範囲を指定する
    const startDate = dayjs
      .utc(fromDate ?? dayjs.utc())
      .endOf('month')
      .subtract(1, 'week')
      .toDate();
    const endDate = dayjs
      .utc(toDate ?? dayjs.utc())
      .endOf('month')
      .add(1, 'week')
      .toDate();

    logger.log('startDate', startDate);
    logger.log('endDate', endDate);
    const data = await this.prisma.calendar.findUnique({
      where: { id },
      include: {
        server: true,
        publicSchedules: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            serverUser: {
              include: {
                user: true,
              },
            },
            participants: {
              include: {
                serverUser: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        personalSchedules: {
          where: {
            OR: [
              {
                AND: [
                  {
                    serverUser: {
                      userId: req.user.id,
                    },
                  },
                  {
                    date: {
                      gte: startDate,
                      lte: endDate,
                    },
                  },
                ],
              },
              {
                AND: [
                  {
                    isPrivate: false,
                  },
                  {
                    serverUser: {
                      NOT: {
                        userId: req.user.id,
                      },
                    },
                  },
                ],
              },
            ],
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            serverUser: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      throw new NotFoundException('カレンダーが見つかりません');
    }

    return data;
  }

  async update(id: string, req: RequestWithUser, body: UpdateCalendarDto) {
    const { name } = body;

    const calendar = await this.prisma.calendar.findUnique({
      where: { id },
    });

    if (!calendar) {
      throw new NotFoundException('カレンダーが見つかりません');
    }

    return this.prisma.calendar.update({
      where: { id },
      data: {
        name,
      },
    });
  }
}
