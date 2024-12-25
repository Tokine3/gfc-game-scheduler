import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePublicScheduleDto } from './dto/create-publicSchedule.dto';
import { RequestWithUser } from 'src/types/request.types';
import { logger } from 'src/utils/logger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FindAllUserSchedulesSchedulesDto } from './dto/findAllUserSchedules-schedules.dto';
import { FindMyPersonalSchedulesScheduleDto } from './dto/findMyPersonalSchedules-schedule.dto';
import { UpsertPersonalScheduleDto } from './dto/upsert-pesonalSchedule.dto';
import { FindPublicSchedulesScheduleDto } from './dto/findPublicShedules-schedules.dto';
// プラグインを追加
dayjs.extend(utc);
dayjs.extend(timezone);
// タイムゾーンを日本に設定
dayjs.tz.setDefault('Asia/Tokyo');

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async createPublicSchedule(
    req: RequestWithUser,
    calendarId: string,
    body: CreatePublicScheduleDto
  ) {
    logger.log('createPublicSchedule', req, body);
    const { date, title, description, quota } = body;
    const { id: userId, name: userName } = req.user;

    const calendar = await this.prisma.calendar.findUnique({
      where: {
        id: calendarId,
      },
    });
    const serverUser = await this.prisma.serverUser.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId: calendar.serverId,
        },
      },
    });

    if (!calendar) {
      throw new NotFoundException('カレンダーが見つかりません');
    }

    return this.prisma.publicSchedule.create({
      data: {
        date: dayjs(date).toDate(),
        title,
        description,
        quota,
        createdBy: userName,
        updatedBy: userName,
        serverUser: {
          connect: {
            id: serverUser.id,
          },
        },
        calendar: {
          connect: {
            id: calendarId,
          },
        },
      },
    });
  }

  async upsertPersonalSchedules(
    req: RequestWithUser,
    calendarId: string,
    body: UpsertPersonalScheduleDto[]
  ) {
    logger.log('createPersonalSchedule', body);
    const { id: userId, name: userName } = req.user;

    const [serverUser, calendar, personalSchedules] = await Promise.all([
      this.prisma.serverUser.findFirst({
        where: {
          userId,
          server: {
            calendars: {
              some: {
                id: calendarId,
              },
            },
          },
        },
      }),
      this.prisma.calendar.findUnique({
        where: {
          id: calendarId,
        },
      }),
      this.prisma.personalSchedule.findMany({
        where: {
          calendarId: calendarId,
          userId: userId,
          date: {
            gte: dayjs().startOf('month').toDate(),
            lte: dayjs().endOf('month').toDate(),
          },
        },
        include: {
          serverUser: true,
        },
      }),
    ]);

    if (!serverUser) {
      throw new NotFoundException('サーバーユーザーが見つかりません');
    }

    if (!calendar) {
      throw new NotFoundException('カレンダーが見つかりません');
    }

    // 既存のスケジュールと新規スケジュールを分離
    const { existingSchedules, newSchedules } = body.reduce(
      (acc, schedule) => {
        const existingSchedule = personalSchedules.find((s) =>
          dayjs(s.date).isSame(dayjs(schedule.date), 'day')
        );

        if (existingSchedule) {
          acc.existingSchedules.push({
            ...schedule,
            id: existingSchedule.id,
          });
        } else {
          acc.newSchedules.push(schedule);
        }

        return acc;
      },
      {
        existingSchedules: [] as (UpsertPersonalScheduleDto & { id: number })[],
        newSchedules: [] as UpsertPersonalScheduleDto[],
      }
    );

    // トランザクション処理で更新と作成を実行
    await this.prisma.$transaction(async (tx) => {
      // 既存のスケジュールを更新
      for (const schedule of existingSchedules) {
        await tx.personalSchedule.update({
          where: { id: schedule.id },
          data: {
            date: dayjs.tz(schedule.date, 'Asia/Tokyo').startOf('day').toDate(),
            title: schedule.title,
            description: schedule.description,
            isPrivate: schedule.isPrivate,
            isFree: schedule.isFree,
            updatedBy: userName,
          },
          include: {
            serverUser: true,
          },
        });
      }

      // 新規スケジュールを作成
      if (newSchedules.length > 0) {
        await tx.personalSchedule.createMany({
          data: newSchedules.map((schedule) => ({
            date: dayjs.tz(schedule.date, 'Asia/Tokyo').startOf('day').toDate(),
            title: schedule.title,
            description: schedule.description,
            isPrivate: schedule.isPrivate,
            isFree: schedule.isFree,
            calendarId,
            serverUserId: serverUser.id,
            userId,
            createdBy: userName,
            updatedBy: userName,
          })),
        });
      }
    });

    // 更新後のスケジュールを取得して返す
    return this.prisma.personalSchedule.findMany({
      where: {
        calendarId,
        userId,
        date: {
          gte: dayjs().startOf('month').toDate(),
          lte: dayjs().endOf('month').toDate(),
        },
      },
      include: {
        serverUser: true,
      },
    });
  }

  async findPublicSchedules(
    req: RequestWithUser,
    calendarId: string,
    query: FindPublicSchedulesScheduleDto
  ) {
    const { fromDate, toDate } = query;

    const publicSchedules = await this.prisma.publicSchedule.findMany({
      where: {
        calendarId,
        date: { gte: fromDate, lte: toDate },
      },
      include: {
        participants: true,
        serverUser: { include: { user: true } },
      },
    });

    return publicSchedules;
  }

  async findMyPersonalSchedules(
    req: RequestWithUser,
    calendarId: string,
    query: FindMyPersonalSchedulesScheduleDto
  ) {
    const { id: userId } = req.user;
    const { fromDate, toDate } = query;

    const personalSchedules = await this.prisma.personalSchedule.findMany({
      where: {
        calendarId,
        userId,
        date: { gte: dayjs(fromDate).toDate(), lte: dayjs(toDate).toDate() },
      },
      include: { serverUser: { include: { user: true } } },
    });

    console.log('personalSchedules', personalSchedules);

    return personalSchedules;
  }

  async findAllUserSchedules(
    req: RequestWithUser,
    calendarId: string,
    query: FindAllUserSchedulesSchedulesDto
  ) {
    const { id: userId } = req.user;
    const { fromDate, toDate } = query;

    const [personalSchedules, publicSchedules] = await Promise.all([
      this.prisma.personalSchedule.findMany({
        where: { calendarId, userId, date: { gte: fromDate, lte: toDate } },
        include: { serverUser: { include: { user: true } } },
      }),
      this.prisma.publicSchedule.findMany({
        where: { calendarId, date: { gte: fromDate, lte: toDate } },
        include: {
          participants: true,
          serverUser: { include: { user: true } },
        },
      }),
    ]);

    console.log('personalSchedules', personalSchedules);
    console.log('publicSchedules', publicSchedules);

    return { personalSchedules, publicSchedules };
  }

  findAll() {
    return `This action returns all schedules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
