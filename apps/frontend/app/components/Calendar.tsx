'use client';

import { useState, useEffect } from 'react';
import EventCreation from './EventCreation';
import PersonalEventCreation from './PersonalEventCreation';
import EventDetail from './EventDetail';
import dayjs from 'dayjs';
import CalendarView from './CalendarView';
import { Button } from './ui/button';
import {
  CalendarIcon,
  CrosshairIcon,
  Gamepad2Icon,
  UserIcon,
  UsersIcon,
  User,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { cn } from '../../lib/utils';

export interface Participant {
  id: number;
  name: string;
  status: 'join' | 'maybe' | 'decline';
  avatarUrl?: string;
}

export interface Event {
  id: number;
  title: string;
  date: Date;
  participants?: Participant[];
  quota?: number;
  isPersonal: boolean;
  creator: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
}

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [showPersonalEventCreation, setShowPersonalEventCreation] =
    useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // ダミーデータを作成
  useEffect(() => {
    const baseDate = dayjs().startOf('day');
    setEvents([
      {
        id: 1,
        title: 'チームデスマッチ',
        date: baseDate.toDate(),
        participants: [
          {
            id: 1,
            name: 'ときね',
            status: 'join',
            avatarUrl: 'https://github.com/Tokine3.png',
          },
          { id: 2, name: 'ユーザー2', status: 'join' },
          { id: 3, name: 'ユーザー3', status: 'maybe' },
          { id: 4, name: 'ユーザー4', status: 'join' },
          { id: 5, name: 'ユーザー5', status: 'join' },
        ],
        quota: 5,
        isPersonal: false,
        creator: {
          id: 1,
          name: 'うなす太郎',
          avatarUrl:
            'https://pbs.twimg.com/profile_images/1727132144026427392/hr4uinlf_400x400.jpg',
        },
      },
      {
        id: 2,
        title: 'コンペティティブ',
        date: baseDate.add(1, 'day').toDate(),
        participants: [
          { id: 6, name: 'ユーザー6', status: 'join' },
          { id: 7, name: 'ユーザー7', status: 'maybe' },
        ],
        quota: 5,
        isPersonal: false,
        creator: {
          id: 2,
          name: 'まる',
          avatarUrl:
            'https://pbs.twimg.com/profile_images/686859461386846209/y-4uA3cH_400x400.jpg',
        },
      },
      {
        id: 3,
        title: '個人練習',
        date: baseDate.add(2, 'day').toDate(),
        isPersonal: true,
        creator: {
          id: 3,
          name: 'うなす太郎',
          avatarUrl:
            'https://pbs.twimg.com/profile_images/1727132144026427392/hr4uinlf_400x400.jpg',
        },
      },
      {
        id: 4,
        title: 'デスマッチ',
        date: baseDate.add(2, 'day').toDate(),
        participants: [
          { id: 8, name: 'ユーザー8', status: 'join' },
          { id: 9, name: 'ユーザー9', status: 'join' },
          { id: 10, name: 'ユーザー10', status: 'join' },
          { id: 11, name: 'ユーザー11', status: 'decline' },
        ],
        quota: 10,
        isPersonal: false,
        creator: {
          id: 4,
          name: 'ときね',
          avatarUrl:
            'https://pbs.twimg.com/profile_images/824190388785348608/vW09xZDi_400x400.jpg',
        },
      },
      {
        id: 5,
        title: '朝からコンペ',
        date: baseDate.add(5, 'day').toDate(),
        participants: [{ id: 12, name: 'ユーザー12', status: 'join' }],
        quota: 5,
        isPersonal: false,
        creator: {
          id: 5,
          name: 'まる',
          avatarUrl:
            'https://pbs.twimg.com/profile_images/686859461386846209/y-4uA3cH_400x400.jpg',
        },
      },
      {
        id: 6,
        title: 'うなす太郎',
        date: baseDate.add(7, 'day').toDate(),
        participants: [
          { id: 13, name: 'ユーザー13', status: 'join' },
          { id: 14, name: 'ユーザー14', status: 'join' },
          { id: 15, name: 'ユーザー15', status: 'join' },
          { id: 16, name: 'ユーザー16', status: 'join' },
          { id: 17, name: 'ユーザー17', status: 'join' },
        ],
        quota: 5,
        isPersonal: false,
        creator: {
          id: 6,
          name: 'ときね',
          avatarUrl:
            'https://pbs.twimg.com/profile_images/1727132144026427392/hr4uinlf_400x400.jpg',
        },
      },
      {
        id: 7,
        title: 'bot撃ち',
        date: baseDate.subtract(7, 'day').toDate(),
        isPersonal: true,
        creator: {
          id: 7,
          name: 'ときね',
          avatarUrl:
            'https://pbs.twimg.com/profile_images/824190388785348608/vW09xZDi_400x400.jpg',
        },
      },
    ]);
    setDate(baseDate.toDate());
  }, []);

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setShowEventCreation(true);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const calendarEvents = events.map((event) => ({
    id: String(event.id),
    start: event.date,
    end: event.date,
    title: event.title,
    extendedProps: {
      isPersonal: event.isPersonal,
      participants: event.participants,
      quota: event.quota,
      originalEvent: event,
    },
  }));

  return (
    <div className='space-y-6 py-6'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <h2 className='text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 flex items-center'>
          <Gamepad2Icon className='mr-2 h-6 w-6 sm:h-8 sm:w-8 text-green-400' />
          ゲームスケジュール
        </h2>
        <div className='flex gap-2 w-full sm:w-auto'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowEventCreation(true)}
                  className='flex-1 sm:flex-none bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600'
                >
                  <CrosshairIcon className='mr-2 h-4 w-4' />
                  <span className='sm:inline'>イベント作成</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>新しいゲームイベントを作成</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowPersonalEventCreation(true)}
                  className='flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                >
                  <UserIcon className='mr-2 h-4 w-4' />
                  <span className='sm:inline'>個人予定作成</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>個人の練習予定を作成</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] gap-6'>
        <div className='bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800/50'>
          <div className='flex items-center justify-center border-b border-gray-800/50 p-4'>
            <h3 className='text-xl font-semibold text-gray-100 flex items-center'>
              <CalendarIcon className='mr-2 h-6 w-6' />
              カレンダー
            </h3>
          </div>
          <div className='p-4'>
            <CalendarView
              date={date}
              events={calendarEvents}
              onDateSelect={handleDateClick}
              onEventClick={handleEventClick}
            />
          </div>
        </div>

        <div className='bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800/50 md:max-h-full'>
          <div className='sticky top-0 z-10 flex items-center justify-center border-b border-gray-800/50 p-4 bg-gray-900/95 backdrop-blur-sm'>
            <h3 className='text-lg sm:text-xl font-semibold text-gray-100 flex items-center'>
              <CrosshairIcon className='mr-2 h-5 w-5 sm:h-6 sm:w-6' />
              今後のイベント
            </h3>
          </div>
          <div className='p-4 space-y-4 max-h-[40vh] md:max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent'>
            {/* 未来のイベント */}
            {events
              .filter((event) => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((event) => {
                const joinCount =
                  event.participants?.filter((p) => p.status === 'join')
                    .length || 0;
                const isAlmostFull =
                  !event.isPersonal &&
                  event.quota &&
                  joinCount === event.quota - 1;
                const isFull =
                  !event.isPersonal && event.quota && joinCount >= event.quota;

                return (
                  <Button
                    key={event.id}
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left border-gray-700 hover:bg-gray-800',
                      event.isPersonal
                        ? 'bg-purple-900/50'
                        : isFull
                          ? 'bg-green-900/50'
                          : isAlmostFull
                            ? 'bg-yellow-900/50'
                            : event.date < new Date()
                              ? 'bg-red-900/50'
                              : ''
                    )}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className='flex items-center w-full'>
                      {event.isPersonal ? (
                        <UserIcon className='mr-2 h-4 w-4 text-purple-400' />
                      ) : (
                        <CrosshairIcon className='mr-2 h-4 w-4 text-cyan-400' />
                      )}
                      <div className='flex-1'>
                        <div className='font-medium text-gray-100'>
                          {event.title}
                        </div>
                        <div className='text-sm text-gray-400'>
                          {dayjs(event.date).format('YYYY年MM月DD日')}
                          {!event.isPersonal && (
                            <>
                              - <UsersIcon className='inline h-3 w-3' />{' '}
                              {event.participants?.filter(
                                (p) => p.status === 'join'
                              ).length || 0}
                              /{event.quota}
                            </>
                          )}
                        </div>
                      </div>
                      {event.creator.avatarUrl ? (
                        <img
                          src={event.creator.avatarUrl}
                          alt={event.creator.name}
                          className='w-6 h-6 rounded-full ml-2 border border-gray-700'
                        />
                      ) : (
                        <div className='w-6 h-6 rounded-full ml-2 bg-gray-700 flex items-center justify-center'>
                          <User className='w-3 h-3 text-gray-400' />
                        </div>
                      )}
                    </div>
                  </Button>
                );
              })}

            {/* 過去のイベントがある場合のみ表示 */}
            {events.some((event) => event.date < new Date()) && (
              <>
                <div className='relative my-6'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t border-gray-700' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-gray-900 px-2 text-gray-500'>
                      過去のイベント
                    </span>
                  </div>
                </div>

                {events
                  .filter((event) => event.date < new Date())
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((event) => (
                    <Button
                      key={event.id}
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left border-gray-800 hover:bg-gray-800/50',
                        'opacity-75 bg-gray-800/30'
                      )}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className='flex items-center w-full'>
                        {event.isPersonal ? (
                          <UserIcon className='mr-2 h-4 w-4 text-gray-500' />
                        ) : (
                          <CrosshairIcon className='mr-2 h-4 w-4 text-gray-500' />
                        )}
                        <div className='flex-1'>
                          <div className='font-medium text-gray-400'>
                            {event.title}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {dayjs(event.date).format('YYYY年MM月DD日')}
                            {!event.isPersonal && (
                              <>
                                - <UsersIcon className='inline h-3 w-3' />{' '}
                                {event.participants?.filter(
                                  (p) => p.status === 'join'
                                ).length || 0}
                                /{event.quota}
                              </>
                            )}
                          </div>
                        </div>
                        {event.creator.avatarUrl ? (
                          <img
                            src={event.creator.avatarUrl}
                            alt={event.creator.name}
                            className='w-6 h-6 rounded-full ml-2 border border-gray-700'
                          />
                        ) : (
                          <div className='w-6 h-6 rounded-full ml-2 bg-gray-700 flex items-center justify-center'>
                            <User className='w-3 h-3 text-gray-400' />
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
              </>
            )}
          </div>
        </div>
      </div>

      {showEventCreation && (
        <EventCreation
          onClose={() => setShowEventCreation(false)}
          date={date}
        />
      )}
      {showPersonalEventCreation && (
        <PersonalEventCreation
          onClose={() => setShowPersonalEventCreation(false)}
          date={date}
        />
      )}
      {showEventDetail && selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setShowEventDetail(false)}
        />
      )}
    </div>
  );
}
