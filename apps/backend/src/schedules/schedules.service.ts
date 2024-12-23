import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePublicScheduleDto } from './dto/create-publicSchedule.dto';
import { CreatePersonalScheduleDto } from './dto/create-pesonalSchedule.dto';
import { RequestWithUser } from 'src/types/request.types';
import { logger } from 'src/utils/logger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { PersonalSchedule } from '@prisma/client';
import { FindAllUserSchedulesSchedulesDto } from './dto/findAllUserSchedules-schedules.dto';

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
        calendar: {
          connect: {
            id: calendarId,
          },
        },
      },
    });
  }

  async createPersonalSchedules(
    req: RequestWithUser,
    calendarId: string,
    body: CreatePersonalScheduleDto[]
  ) {
    logger.log('createPersonalSchedule', body);
    const { id: userId, name: userName } = req.user;

    const [calendar, personalSchedules] = await Promise.all([
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
      }),
    ]);

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
        existingSchedules: [] as (CreatePersonalScheduleDto & { id: number })[],
        newSchedules: [] as CreatePersonalScheduleDto[],
      }
    );

    // トランザクション処理で更新と作成を実行
    await this.prisma.$transaction(async (tx) => {
      // 既存のスケジュールを更新
      for (const schedule of existingSchedules) {
        await tx.personalSchedule.update({
          where: { id: schedule.id },
          data: schedule,
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
            createdBy: userName,
            updatedBy: userName,
            userId,
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
        user: true,
      },
    });
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
      }),
      this.prisma.publicSchedule.findMany({
        where: { calendarId, date: { gte: fromDate, lte: toDate } },
        include: {
          participants: true,
        },
      }),
    ]);

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
