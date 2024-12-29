import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePublicScheduleDto } from './dto/update-publicSchedule.dto';
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
import { Prisma } from '@prisma/client';
import { RemovePublicScheduleDto } from './dto/remove-publicSchedule-schedules.dto';
import { RemovePersonalScheduleDto } from './dto/remove-personalSchedule-schedules.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';

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
        date: dayjs(date).startOf('day').toDate(),
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
    logger.log('upsertPersonalSchedules start', {
      calendarId,
      scheduleCount: body.length,
    });
    const { id: userId, name: userName } = req.user;

    // 送信されたスケジュールの日付範囲を取得
    const dates = body.map((s) => dayjs(s.date));
    const minDate = dates
      .reduce((min, curr) => (curr.isBefore(min) ? curr : min))
      .startOf('month');
    const maxDate = dates
      .reduce((max, curr) => (curr.isAfter(max) ? curr : max))
      .endOf('month');

    try {
      // サーバーユーザーと既存のスケジュールを並行で取得
      const [serverUser, existingSchedules] = await Promise.all([
        this.prisma.serverUser.findFirstOrThrow({
          where: {
            userId,
            server: {
              calendars: {
                some: { id: calendarId },
              },
            },
          },
          select: { id: true },
        }),
        this.prisma.personalSchedule.findMany({
          where: {
            calendarId,
            userId,
            date: {
              gte: minDate.toDate(),
              lte: maxDate.toDate(),
            },
          },
          select: {
            id: true,
            date: true,
          },
        }),
      ]);

      // 更新対象と新規作成対象を分類
      const updates: Prisma.Prisma__PersonalScheduleClient<any>[] = [];
      const creates: Prisma.PersonalScheduleCreateManyInput[] = [];

      body.forEach((schedule) => {
        const scheduleDate = dayjs(schedule.date)
          .tz('Asia/Tokyo')
          .startOf('day');
        const existing = existingSchedules.find((e) =>
          dayjs(e.date).isSame(scheduleDate, 'day')
        );

        const scheduleData = {
          date: scheduleDate.toDate(),
          title: schedule.title || '',
          description: schedule.description || '',
          isPrivate: schedule.isPrivate || false,
          isFree: schedule.isFree || false,
          updatedBy: userName,
        };

        if (existing) {
          updates.push(
            this.prisma.personalSchedule.update({
              where: { id: existing.id },
              data: scheduleData,
            })
          );
        } else {
          creates.push({
            ...scheduleData,
            calendarId,
            serverUserId: serverUser.id,
            userId,
            createdBy: userName,
          });
        }
      });

      // トランザクションで一括処理
      await this.prisma.$transaction(
        async (tx) => {
          if (updates.length > 0) {
            await Promise.all(updates);
          }
          if (creates.length > 0) {
            await tx.personalSchedule.createMany({ data: creates });
          }
        },
        {
          timeout: 10000,
          maxWait: 5000,
        }
      );

      // 更新された範囲のスケジュールを返却
      const updatedSchedules = await this.prisma.personalSchedule.findMany({
        where: {
          calendarId,
          userId,
          date: {
            gte: minDate.toDate(),
            lte: maxDate.toDate(),
          },
        },
        include: {
          serverUser: true,
        },
      });

      logger.log('upsertPersonalSchedules complete', {
        updated: updates.length,
        created: creates.length,
        total: updatedSchedules.length,
      });

      return updatedSchedules;
    } catch (error) {
      logger.error('upsertPersonalSchedules failed', error);
      throw new BadRequestException('スケジュールの更新に失敗しました');
    }
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
        date: {
          gte: dayjs(fromDate).tz('Asia/Tokyo').toDate(),
          lte: dayjs(toDate).tz('Asia/Tokyo').toDate(),
        },
      },
      include: {
        participants: { include: { serverUser: { include: { user: true } } } },
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
        date: {
          gte: dayjs(fromDate).tz('Asia/Tokyo').toDate(),
          lte: dayjs(toDate).tz('Asia/Tokyo').toDate(),
        },
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
        where: {
          calendarId,
          userId,
          date: {
            gte: dayjs(fromDate).tz('Asia/Tokyo').toDate(),
            lte: dayjs(toDate).tz('Asia/Tokyo').toDate(),
          },
        },
        include: { serverUser: { include: { user: true } } },
      }),
      this.prisma.publicSchedule.findMany({
        where: {
          calendarId,
          date: {
            gte: dayjs(fromDate).tz('Asia/Tokyo').toDate(),
            lte: dayjs(toDate).tz('Asia/Tokyo').toDate(),
          },
        },
        include: {
          participants: {
            include: { serverUser: { include: { user: true } } },
          },
          serverUser: { include: { user: true } },
        },
      }),
    ]);

    console.log('personalSchedules', personalSchedules);
    console.log('publicSchedules', publicSchedules);

    return { personalSchedules, publicSchedules };
  }

  updatePublicSchedule(
    req: RequestWithUser,
    id: number,
    body: UpdatePublicScheduleDto
  ) {
    const { calendarId } = body;
    const { id: userId } = req.user;

    return this.prisma.publicSchedule
      .update({
        where: { id, calendarId, serverUser: { userId } },
        data: body,
        include: {
          participants: {
            include: { serverUser: { include: { user: true } } },
          },
          serverUser: { include: { user: true } },
        },
      })
      .catch((error) => {
        throw new BadRequestException('スケジュール更新に失敗しました');
      });
  }

  async updateReaction(
    req: RequestWithUser,
    id: number,
    body: UpdateReactionDto
  ) {
    const { calendarId, reaction } = body;
    const { id: userId } = req.user;

    console.log('reaction', reaction);

    // 既存の参加者を確認
    const existingParticipant = await this.prisma.participant.findFirst({
      where: {
        publicSchedule: {
          id,
          calendarId,
        },
        serverUser: {
          userId,
        },
      },
    });

    if (existingParticipant) {
      // 既存の参加者を更新
      return this.prisma.participant.update({
        where: { id: existingParticipant.id },
        data: { reaction },
        include: {
          publicSchedule: true,
          serverUser: { include: { user: true } },
        },
      });
    }

    // 新規参加者を作成
    const serverUser = await this.prisma.serverUser.findFirst({
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
    });

    if (!serverUser) {
      throw new Error('Server user not found');
    }

    return this.prisma.participant.create({
      data: {
        serverUserId: serverUser.id,
        publicScheduleId: id,
        reaction,
      },
      include: {
        publicSchedule: true,
        serverUser: { include: { user: true } },
      },
    });
  }

  removePublicSchedule(
    req: RequestWithUser,
    id: number,
    body: RemovePublicScheduleDto
  ) {
    const { calendarId, isDeleted } = body;
    const { id: userId } = req.user;
    // 論理削除
    return this.prisma.publicSchedule
      .update({
        where: { id, calendarId, serverUser: { userId } },
        data: { isDeleted },
      })
      .catch((error) => {
        throw new BadRequestException('スケジュール削除に失敗しました');
      });
  }

  removePersonalSchedule(
    req: RequestWithUser,
    id: number,
    body: RemovePersonalScheduleDto
  ) {
    const { calendarId } = body;
    const { id: userId } = req.user;

    // 物理削除
    return this.prisma.personalSchedule
      .delete({
        where: { id, calendarId, userId },
      })
      .catch((error) => {
        throw new BadRequestException('スケジュール削除に失敗しました');
      });
  }
}
