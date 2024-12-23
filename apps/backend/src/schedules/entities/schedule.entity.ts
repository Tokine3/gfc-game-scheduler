import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  userId: string;

  @ApiProperty({ description: '参加者名' })
  name: string;

  @ApiProperty({ description: '参加者反応', enum: ['OK', 'UNDECIDED', 'NG'] })
  reaction: 'OK' | 'UNDECIDED' | 'NG';

  @ApiProperty({ description: '参加者反応日' })
  createdAt: Date;

  @ApiProperty({ description: '参加者反応更新日' })
  updatedAt: Date;
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

  @ApiProperty({ description: '参加者', type: [Participant] })
  @Type(() => Participant)
  participants: Participant[];
}

export class AllUserSchedules {
  @ApiProperty({ description: '個人スケジュール', type: [PersonalSchedule] })
  personalSchedules: PersonalSchedule[];

  @ApiProperty({ description: '公開スケジュール', type: [PublicSchedule] })
  publicSchedules: PublicSchedule[];
}
