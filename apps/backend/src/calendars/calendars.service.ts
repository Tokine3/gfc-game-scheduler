import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { RequestWithUser } from '../types/request.types';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { logger } from 'src/utils/logger';

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

  async findOne(id: string) {
    return this.prisma.calendar.findUnique({
      where: { id },
      include: {
        server: true,
        publicSchedules: {
          include: {
            participants: true,
          },
        },
        personalSchedules: true,
      },
    });
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
