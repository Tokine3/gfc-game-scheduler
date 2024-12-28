import { ApiProperty } from '@nestjs/swagger';
import { Reaction } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ServerUser,
  ServerUserWithRelations,
} from 'src/servers/entities/server.entity';
import { User } from 'src/user/entities/user.entity';

export class ScheduleUserInfo {
  @ApiProperty({ description: 'ユーザーID' })
  id: string;

  @ApiProperty({ description: 'ユーザー名' })
  name: string;

  @ApiProperty({ description: 'アバターURL' })
  avatar: string | null;
}

export class BaseSchedule {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '日付' })
  date: string;

  @ApiProperty({ description: 'タイトル' })
  title: string;

  @ApiProperty({ description: '説明' })
  description: string | null;

  @ApiProperty({ description: '作成者名' })
  createdBy: string;

  @ApiProperty({ description: '更新者名' })
  updatedBy: string;

  @ApiProperty({ description: '作成日' })
  createdAt: Date;

  @ApiProperty({ description: '更新日' })
  updatedAt: Date;
}

export class Participant {
  @ApiProperty({ description: '参加者ID' })
  id: number;

  @ApiProperty({ description: 'サーバーユーザーID' })
  serverUserId: number;

  @ApiProperty({ description: '公開予定ID' })
  publicScheduleId: number;

  @ApiProperty({ description: '参加者反応', enum: Reaction })
  reaction: Reaction;

  @ApiProperty({ description: '作成日時' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時' })
  updatedAt: Date;
}

export class ParticipantWithRelations extends Participant {
  @ApiProperty({
    description: 'サーバーユーザー情報',
    type: () => ServerUserWithRelations,
  })
  @Type(() => ServerUserWithRelations)
  serverUser: ServerUserWithRelations;
}

export class PersonalSchedule extends BaseSchedule {
  @ApiProperty({ description: '非公開フラグ' })
  isPrivate: boolean;

  @ApiProperty({ description: '空き予定フラグ' })
  isFree: boolean;

  @ApiProperty({ description: '個人予定フラグ', default: true })
  isPersonal: boolean;
}

export class PublicSchedule extends BaseSchedule {
  @ApiProperty({ description: '募集人数' })
  quota: number;

  @ApiProperty({ description: '募集状況' })
  isRecruiting: boolean;

  @ApiProperty({ description: '個人予定フラグ', default: false })
  isPersonal: boolean;

  @ApiProperty({ description: '削除フラグ', default: false })
  isDeleted: boolean;

  @ApiProperty({
    description: '参加者',
    type: () => [ParticipantWithRelations],
  })
  @Type(() => ParticipantWithRelations)
  participants: ParticipantWithRelations[];
}

export class PublicScheduleWithRelations extends PublicSchedule {
  @ApiProperty({
    description: '参加者',
    type: () => [ParticipantWithRelations],
  })
  @Type(() => ParticipantWithRelations)
  participants: ParticipantWithRelations[];

  @ApiProperty({
    description: 'サーバユーザ',
    type: () => ServerUserWithRelations,
  })
  @Type(() => ServerUserWithRelations)
  serverUser: ServerUserWithRelations;
}

export class PersonalScheduleWithRelations extends PersonalSchedule {
  @ApiProperty({
    description: 'サーバユーザ',
    type: () => ServerUserWithRelations,
  })
  @Type(() => ServerUserWithRelations)
  serverUser: ServerUserWithRelations;
}

export class AllUserSchedules {
  @ApiProperty({
    description: '個人スケジュール',
    type: () => [PersonalScheduleWithRelations],
  })
  personalSchedules: PersonalScheduleWithRelations[];

  @ApiProperty({
    description: '公開スケジュール',
    type: () => [PublicScheduleWithRelations],
  })
  publicSchedules: PublicScheduleWithRelations[];
}
