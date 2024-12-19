import {
  PublicScheduleWithRelations,
  PersonalScheduleWithRelations,
} from '../apis/@types';
import dayjs from 'dayjs';

export const mockPublicEvent: PublicScheduleWithRelations = {
  id: '1',
  title: 'スクリム練習会',
  description:
    '参加者を募集中です！\n初心者歓迎、みんなで楽しく練習しましょう。\n\n持ち物：\n- ボイスチャット可能な環境\n- やる気',
  date: dayjs().add(2, 'day').hour(20).minute(0).second(0).toISOString(),
  recruitCount: 5,
  isPersonal: false,
  createdBy: {
    id: '1',
    name: 'プレイヤー1',
    avatar: '',
  },
  updatedBy: {
    id: '1',
    name: 'プレイヤー1',
    avatar: '',
  },
  createdById: '1',
  updatedById: '1',
  createdAt: dayjs().toISOString(),
  updatedAt: dayjs().toISOString(),
  isRecruiting: true,
  participants: [
    {
      userId: '1',
      reaction: 'OK',
      name: 'プレイヤー1',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    },
    {
      userId: '2',
      reaction: 'OK',
      name: 'プレイヤー2',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    },
    {
      userId: '3',
      reaction: 'UNDECIDED',
      name: 'プレイヤー3',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    },
    {
      userId: '4',
      name: 'プレイヤー4',
      reaction: 'NG',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    },
  ],
};

export const mockPersonalEvent: PersonalScheduleWithRelations = {
  id: '2',
  title: '個人練習',
  date: dayjs().add(1, 'day').hour(15).minute(0).second(0).toISOString(),
  isPersonal: true,
  isFree: true,
  description:
    '参加者を募集中です！\n初心者歓迎、みんなで楽しく練習しましょう。\n\n持ち物：\n- ボイスチャット可能な環境\n- やる気',
  createdBy: {
    id: '1',
    name: 'プレイヤー1',
    avatar: '',
  },
  updatedBy: {
    id: '1',
    name: 'プレイヤー1',
    avatar: '',
  },
  createdAt: dayjs().toISOString(),
  updatedAt: dayjs().toISOString(),
  createdById: '1',
  updatedById: '1',
  isPrivate: false,
  user: {
    id: '1',
    name: 'プレイヤー1',
    avatar: '',
    createdAt: dayjs().toISOString(),
    updatedAt: dayjs().toISOString(),
    lastLoggedInAt: dayjs().toISOString(),
  },
};
