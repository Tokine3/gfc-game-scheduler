'use client';

import { useState, useEffect, useCallback, memo } from 'react';
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
  CalendarDays,
  Settings,
  Bell,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { cn } from '../../lib/utils';
import EventTypeSelector from './EventTypeSelector';
import {
  CalendarWithRelations,
  PersonalScheduleWithRelations,
  PublicScheduleWithRelations,
} from '../../apis/@types';
import { logger } from '../../lib/logger';

export type CalendarEvent =
  | PublicScheduleWithRelations
  | PersonalScheduleWithRelations;

// 型ガードの追加
export function isPublicSchedule(
  event: CalendarEvent
): event is PublicScheduleWithRelations {
  return !event.isPersonal;
}

// 型定義を追加
export type Availability = {
  date: string;
  count: number;
  users: Array<{
    id: string;
    name: string;
    avatar: string | null;
  }>;
};

// サブコンポーネントをメモ化
const MemoizedCalendarView = memo(CalendarView);
const MemoizedEventCreation = memo(EventCreation);
const MemoizedPersonalEventCreation = memo(PersonalEventCreation);
const MemoizedEventDetail = memo(EventDetail);
const MemoizedEventTypeSelector = memo(EventTypeSelector);

export default memo(function Calendar(props: CalendarWithRelations) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [showPersonalEventCreation, setShowPersonalEventCreation] =
    useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  logger.log('calendar', props);

  // コールバック関数をメモ化
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setDate(date);
      setShowTypeSelector(true);
    }
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  }, []);

  const handleEventTypeChange = useCallback((type: 'public' | 'personal') => {
    if (type === 'public') {
      setShowEventCreation(true);
    } else {
      setShowPersonalEventCreation(true);
    }
    setShowTypeSelector(false);
  }, []);

  // イベントの取得をメモ化
  const fetchEvents = useCallback(async () => {
    try {
      const [publicEvents, personalEvents] = await Promise.all([
        props.publicSchedules,
        props.personalSchedules,
      ]);
      setEvents([...publicEvents, ...personalEvents]);
    } catch (error) {
      logger.error('Failed to fetch events:', error);
    }
  }, [props.publicSchedules, props.personalSchedules]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // カレンダーコンポーネントで空き予定を集計
  useEffect(() => {
    const freeSchedules = props.personalSchedules.filter(
      (schedule) => schedule.isFree
    );

    const availabilityMap = freeSchedules.reduce(
      (acc, schedule) => {
        const dateStr = dayjs(schedule.date).format('YYYY-MM-DD');
        if (!acc[dateStr]) {
          acc[dateStr] = {
            date: dateStr,
            count: 0,
            users: [],
          };
        }
        acc[dateStr].count += 1;
        acc[dateStr].users.push({
          id: schedule.user.id,
          name: schedule.user.name,
          avatar: schedule.user.avatar,
        });
        return acc;
      },
      {} as Record<string, Availability>
    );

    setAvailabilities(Object.values(availabilityMap));
  }, [props.personalSchedules]);

  // CalendarViewに渡すイベントデータを変換
  const calendarEvents = events.map((event) => ({
    id: event.id,
    start: new Date(event.date),
    end: new Date(event.date),
    title: isPublicSchedule(event) ? event.title : event.title,
    extendedProps: {
      isPersonal: event.isPersonal,
      participants: isPublicSchedule(event) ? event.participants : undefined,
      quota: isPublicSchedule(event) ? event.recruitCount : undefined,
      originalEvent: event,
    },
  }));

  return (
    <div className='space-y-6'>
      {/* アクションバー - スマート化 */}
      <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='p-2.5 bg-purple-500/10 rounded-lg'>
              <CalendarDays className='w-5 h-5 text-purple-400' />
            </div>
            <h2 className='text-base sm:text-lg font-semibold text-gray-100'>
              イベントを作成
            </h2>
          </div>

          <div className='grid grid-cols-1 sm:flex gap-2 w-full sm:w-auto'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowEventCreation(true)}
                    className='w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                  >
                    <CrosshairIcon className='w-4 h-4 sm:mr-2' />
                    <span className='ml-2 sm:ml-0'>イベント作成</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>新しいゲームイベントを作成</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowPersonalEventCreation(true)}
                    variant='outline'
                    className='w-full sm:w-auto border-purple-500/30 text-purple-200 hover:bg-purple-500/10'
                  >
                    <UserIcon className='w-4 h-4 sm:mr-2' />
                    <span className='ml-2 sm:ml-0'>個人予定作成</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>個人の練習予定を作成</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* カレンダーグリッド - レスポンシブ対応 */}
      <div className='grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6'>
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 sm:p-6 overflow-hidden'>
          <MemoizedCalendarView
            date={date}
            events={calendarEvents}
            availabilities={availabilities}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
          />
        </div>

        {/* イベントリスト - モバイル対応 */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50'>
          <div className='lg:sticky lg:top-32 max-h-[calc(100vh-8rem)] overflow-y-auto'>
            <div className='p-3 sm:p-4 border-b border-gray-700/50 bg-gray-800/95 backdrop-blur-sm sticky top-0 z-10'>
              <h3 className='text-base sm:text-lg font-semibold text-gray-100 flex items-center gap-2'>
                <CrosshairIcon className='w-4 h-4 sm:w-5 sm:h-5 text-purple-400' />
                今後のイベント
              </h3>
            </div>

            {/* イベントリストの内容は既存のまま */}
            <div className='p-4 space-y-4 max-h-[40vh] md:max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent'>
              {/* 未来のイベント */}
              {events
                .filter((event) => new Date(event.date) >= new Date())
                .sort(
                  (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
                )
                .map((event) => {
                  const joinCount = isPublicSchedule(event)
                    ? event.participants?.filter((p) => p.reaction === 'OK')
                        .length
                    : 0;

                  const isAlmostFull =
                    isPublicSchedule(event) &&
                    joinCount === event.recruitCount - 1;

                  const isFull =
                    isPublicSchedule(event) && joinCount >= event.recruitCount;

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
                              : dayjs(event.date).isBefore(dayjs())
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
                            {isPublicSchedule(event)
                              ? event.title
                              : event.title}
                          </div>
                          <div className='text-sm text-gray-400'>
                            {dayjs(event.date).format('YYYY年MM月DD日')}
                            {isPublicSchedule(event) && (
                              <>
                                - <UsersIcon className='inline h-3 w-3' />{' '}
                                {event.participants?.filter(
                                  (p) => p.reaction === 'OK'
                                ).length || 0}
                                /{event.recruitCount}
                              </>
                            )}
                          </div>
                        </div>
                        {event.createdBy.avatar ? (
                          <img
                            src={`https://cdn.discordapp.com/icons/${event.createdBy.id}/${event.createdBy.avatar}.png`}
                            alt={event.createdBy.name}
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
              {events.some((event) => dayjs(event.date).isBefore(dayjs())) && (
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
                    .filter((event) => dayjs(event.date).isBefore(dayjs()))
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
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
                              {isPublicSchedule(event)
                                ? event.title
                                : event.title}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {dayjs(event.date).format('YYYY年MM月DD日')}
                              {!event.isPersonal && isPublicSchedule(event) && (
                                <>
                                  - <UsersIcon className='inline h-3 w-3' />{' '}
                                  {event.participants?.filter(
                                    (p) => p.reaction === 'OK'
                                  ).length || 0}
                                  /{event.recruitCount}
                                </>
                              )}
                            </div>
                          </div>
                          {event.createdBy.avatar ? (
                            <img
                              src={`https://cdn.discordapp.com/avatars/${event.createdBy.id}/${event.createdBy.avatar}.png`}
                              alt={event.createdBy.name}
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
      </div>

      {/* モーダル類は既存のまま */}
      {showTypeSelector && (
        <MemoizedEventTypeSelector
          onClose={() => setShowTypeSelector(false)}
          onSelectEvent={() => {
            setShowTypeSelector(false);
            setShowEventCreation(true);
          }}
          onSelectPersonal={() => {
            setShowTypeSelector(false);
            setShowPersonalEventCreation(true);
          }}
        />
      )}

      {showEventCreation && (
        <MemoizedEventCreation
          onClose={() => setShowEventCreation(false)}
          date={date}
        />
      )}
      {showPersonalEventCreation && (
        <MemoizedPersonalEventCreation
          onClose={() => setShowPersonalEventCreation(false)}
          date={date}
        />
      )}
      {showEventDetail && selectedEvent && (
        <MemoizedEventDetail
          event={selectedEvent}
          onClose={() => setShowEventDetail(false)}
        />
      )}
    </div>
  );
});
