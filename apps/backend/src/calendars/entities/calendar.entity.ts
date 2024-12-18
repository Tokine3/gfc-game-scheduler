import { ApiProperty } from '@nestjs/swagger';
import { Reaction } from '@prisma/client';
import {
  PersonalSchedule,
  PublicSchedule,
} from 'src/schedules/entities/schedule.entity';
import { Server } from 'src/servers/entities/server.entity';
import { User } from 'src/user/entities/user.entity';
export class Calendar {
  @ApiProperty({ description: 'カレンダーID' })
  id: string;
  @ApiProperty({ description: 'サーバーID' })
  serverId: string;
  @ApiProperty({ description: 'カレンダー名' })
  name: string;
  @ApiProperty({ description: '作成日' })
  createdAt: Date;
  @ApiProperty({ description: '更新日' })
  updatedAt: Date;
}

export class UserInfo {
  @ApiProperty({ description: 'ユーザーID' })
  id: string;

  @ApiProperty({ description: 'ユーザー名' })
  name: string;

  @ApiProperty({ description: 'アバターURL' })
  avatar: string | null;
}

// export class PublicSchedule {
//   @ApiProperty({ description: '公開予定ID' })
//   id: string;
//   @ApiProperty({ description: 'イベント名' })
//   title: string;
//   @ApiProperty({ description: '日にち' })
//   date: Date;
//   @ApiProperty({ description: '内容' })
//   description: string | null;
//   @ApiProperty({ description: '募集人数' })
//   recruitCount: number;
//   @ApiProperty({ description: '募集状況' })
//   isRecruiting: boolean;
//   @ApiProperty({ description: '作成者情報' })
//   createdBy: UserInfo;
//   @ApiProperty({ description: '更新者情報' })
//   updatedBy: UserInfo;
//   @ApiProperty({ description: '作成者ID' })
//   createdById: string;
//   @ApiProperty({ description: '更新者ID' })
//   updatedById: string;
//   @ApiProperty({ description: '公開予定作成日' })
//   createdAt: Date;
//   @ApiProperty({ description: '公開予定更新日' })
//   updatedAt: Date;
//   @ApiProperty({ description: '個人予定フラグ', default: false })
//   isPersonal: boolean;
// }

// export class PersonalSchedule {
//   @ApiProperty({ description: '個人予定ID' })
//   id: string;
//   @ApiProperty({ description: 'イベント名' })
//   title: string;
//   @ApiProperty({ description: '日にち' })
//   date: Date;
//   @ApiProperty({ description: '非公開フラグ' })
//   isPrivate: boolean;
//   @ApiProperty({ description: '空きフラグ' })
//   isFree: boolean;
//   @ApiProperty({ description: '内容' })
//   description: string | null;
//   @ApiProperty({ description: '作成者情報' })
//   createdBy: UserInfo;
//   @ApiProperty({ description: '更新者情報' })
//   updatedBy: UserInfo;
//   @ApiProperty({ description: '作成者ID' })
//   createdById: string;
//   @ApiProperty({ description: '更新者ID' })
//   updatedById: string;
//   @ApiProperty({ description: '作成日' })
//   createdAt: Date;
//   @ApiProperty({ description: '更新日' })
//   updatedAt: Date;
//   @ApiProperty({ description: '個人予定フラグ', default: true })
//   isPersonal: boolean;
// }

export class Participant {
  @ApiProperty({ description: '参加者ID' })
  userId: string;
  @ApiProperty({ description: '参加者名' })
  name: string;
  @ApiProperty({ description: '参加者反応', enum: Reaction })
  reaction: Reaction;
  @ApiProperty({ description: '参加者反応日' })
  createdAt: Date;
  @ApiProperty({ description: '参加者反応更新日' })
  updatedAt: Date;
}

export class PublicScheduleWithRelations extends PublicSchedule {
  @ApiProperty({ description: '参加者', type: [Participant] })
  participants: Participant[];
}

export class PersonalScheduleWithRelations extends PersonalSchedule {
  @ApiProperty({ description: '作成したユーザ', type: User })
  user: User;
}

export class Events {
  @ApiProperty({ description: '公開予定', type: [PublicScheduleWithRelations] })
  publicSchedules: PublicScheduleWithRelations[];
  @ApiProperty({ description: '個人予定', type: [PersonalSchedule] })
  personalSchedules: PersonalSchedule[];
}

export class CalendarWithRelations extends Calendar {
  @ApiProperty({ description: 'サーバー', type: () => Server })
  server: Server;
  @ApiProperty({ description: '公開予定', type: [PublicScheduleWithRelations] })
  publicSchedules: PublicScheduleWithRelations[];
  @ApiProperty({
    description: '個人予定',
    type: [PersonalScheduleWithRelations],
  })
  personalSchedules: PersonalScheduleWithRelations[];
}
