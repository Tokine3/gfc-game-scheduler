import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { RequestWithUser } from '../types/request.types';
import { PrismaService } from '../prisma/prisma.service';
import { logger } from 'src/utils/logger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// プラグインを追加
dayjs.extend(utc);
dayjs.extend(timezone);
// タイムゾーンを日本に設定
dayjs.tz.setDefault('Asia/Tokyo');

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
    console.log('fromDate', fromDate);
    console.log('toDate', toDate);

    // イベントの取得範囲を指定する
    // 先月の1週間前から翌月の1週間後までの範囲を取得する
    const startDate = dayjs(fromDate ?? dayjs())
      .tz('Asia/Tokyo')
      .subtract(1, 'week')
      .startOf('month')
      .toDate();
    const endDate = dayjs(toDate ?? dayjs())
      .tz('Asia/Tokyo')
      .add(1, 'week')
      .endOf('month')
      .toDate();

    console.log('startDate', startDate);
    console.log('endDate', endDate);
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
