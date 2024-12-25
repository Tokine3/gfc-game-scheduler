import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { RequestWithUser } from '../types/request.types';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { logger } from 'src/utils/logger';
import dayjs from 'dayjs';

@Injectable()
export class CalendarsService {
  private userCache: Map<string, User> = new Map();

  constructor(private readonly prisma: PrismaService) {}
  create(req: RequestWithUser, body: CreateCalendarDto) {
    logger.log('CALENDARS SERVICE');
    logger.log(body);
    const { name, serverId, serverName } = body;
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
    const data = await this.prisma.calendar.findUnique({
      where: { id },
      include: {
        server: true,
        publicSchedules: {
          where: {
            date: {
              gte:
                dayjs(fromDate).startOf('day').toDate() ??
                dayjs().startOf('day').toDate(),
              lte:
                dayjs(toDate).endOf('day').toDate() ??
                dayjs().endOf('day').toDate(),
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
                user: true,
              },
            },
          },
        },
        personalSchedules: {
          where: {
            AND: [
              {
                serverUser: {
                  userId: req.user.id,
                },
              },
              {
                date: {
                  gte:
                    dayjs(fromDate).startOf('day').toDate() ??
                    dayjs().startOf('day').toDate(),
                  lte:
                    dayjs(toDate).endOf('day').toDate() ??
                    dayjs().endOf('day').toDate(),
                },
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

  remove(id: number) {
    return `This action removes a #${id} calendar`;
  }
}
