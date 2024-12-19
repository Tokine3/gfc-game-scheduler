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
import { mockPublicEvent, mockPersonalEvent } from '../../mock/events';

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
    isAvailable: boolean;
    isJoined: boolean;
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
      // 開発用にモックデータを使用
      setEvents([mockPublicEvent, mockPersonalEvent]);
    } catch (error) {
      logger.error('Failed to fetch events:', error);
    }
  }, []);

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
          isAvailable: schedule.isFree,
          isJoined: false,
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
    title: event.title,
    extendedProps: {
      isPersonal: event.isPersonal,
      participants: isPublicSchedule(event) ? event.participants : undefined,
      quota: isPublicSchedule(event) ? event.recruitCount : undefined,
      originalEvent: event,
    },
  }));

  return (
    <div className='space-y-6'>
      {/* アクションバー */}
      <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='p-2.5 bg-purple-500/10 rounded-lg'>
              <CalendarDays className='w-5 h-5 text-purple-400' />
            </div>
            <div className='space-y-1'>
              <h2 className='text-lg font-semibold text-gray-100'>
                イベントカレンダー
              </h2>
              <p className='text-sm text-gray-400'>
                ゲームイベントや個人の予定を管理できます
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:flex gap-2 w-full sm:w-auto'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowEventCreation(true)}
                    className='w-full sm:w-auto bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
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
                    className='w-full sm:w-auto bg-gradient-to-r from-gray-900/50 to-gray-800/50 hover:from-gray-800/50 hover:to-gray-700/50 border-purple-500/20 text-purple-100 hover:text-purple-50 shadow-lg shadow-purple-500/10'
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

      {/* カレンダーグリッド */}
      <div className='grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6'>
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 overflow-hidden'>
          <MemoizedCalendarView
            date={date}
            events={calendarEvents}
            availabilities={availabilities}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
          />
        </div>

        {/* イベントリスト */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50'>
          <div className='lg:sticky lg:top-32 max-h-[calc(100vh-8rem)] overflow-y-auto'>
            {/* 今後のイベント */}
            <div className='p-4 border-b border-gray-700/50 bg-gray-800/95 backdrop-blur-sm sticky top-0 z-10'>
              <h3 className='text-lg font-semibold text-gray-100 flex items-center gap-2'>
                <CrosshairIcon className='w-5 h-5 text-purple-400' />
                今後のイベント
              </h3>
            </div>

            <div className='p-4 space-y-3'>
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
                  const isFull =
                    isPublicSchedule(event) && joinCount >= event.recruitCount;

                  return (
                    <Button
                      key={event.id}
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left border-gray-700/50 hover:bg-gray-800/60 group relative overflow-hidden',
                        event.isPersonal
                          ? 'bg-purple-500/10'
                          : isFull
                            ? 'bg-green-500/10'
                            : 'bg-cyan-500/10'
                      )}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity' />
                      <div className='relative flex items-center w-full gap-3'>
                        <div
                          className={cn(
                            'p-2 rounded-lg',
                            event.isPersonal
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-cyan-500/20 text-cyan-400'
                          )}
                        >
                          {event.isPersonal ? (
                            <UserIcon className='w-4 h-4' />
                          ) : (
                            <CrosshairIcon className='w-4 h-4' />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-gray-200 truncate'>
                            {isPublicSchedule(event)
                              ? event.title
                              : event.title}
                          </div>
                          <div className='text-sm text-gray-400 flex items-center gap-2'>
                            <span>
                              {dayjs(event.date).format('YYYY年MM月DD日')}
                            </span>
                            {isPublicSchedule(event) && (
                              <span className='flex items-center gap-1'>
                                <UsersIcon className='w-3 h-3' />
                                {joinCount}/{event.recruitCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}

              {events.filter((event) => new Date(event.date) >= new Date())
                .length === 0 && (
                <div className='text-sm text-gray-500 text-center py-4'>
                  予定されているイベントはありません
                </div>
              )}
            </div>

            {/* 過去のイベント */}
            <div className='p-4 border-t border-b border-gray-700/50 bg-gray-800/95 backdrop-blur-sm sticky top-0 z-10'>
              <h3 className='text-lg font-semibold text-gray-100 flex items-center gap-2'>
                <CalendarDays className='w-5 h-5 text-gray-400' />
                過去のイベント
              </h3>
            </div>

            <div className='p-4 space-y-3'>
              {events
                .filter((event) => new Date(event.date) < new Date())
                .sort(
                  (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                ) // 新しい順
                .map((event) => {
                  const joinCount = isPublicSchedule(event)
                    ? event.participants?.filter((p) => p.reaction === 'OK')
                        .length
                    : 0;

                  return (
                    <Button
                      key={event.id}
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left border-gray-700/50 hover:bg-gray-800/60 group relative overflow-hidden opacity-75',
                        event.isPersonal ? 'bg-purple-500/5' : 'bg-cyan-500/5'
                      )}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity' />
                      <div className='relative flex items-center w-full gap-3'>
                        <div
                          className={cn(
                            'p-2 rounded-lg',
                            event.isPersonal
                              ? 'bg-purple-500/10 text-purple-400/75'
                              : 'bg-cyan-500/10 text-cyan-400/75'
                          )}
                        >
                          {event.isPersonal ? (
                            <UserIcon className='w-4 h-4' />
                          ) : (
                            <CrosshairIcon className='w-4 h-4' />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-gray-400 truncate'>
                            {event.title}
                          </div>
                          <div className='text-sm text-gray-500 flex items-center gap-2'>
                            <span>
                              {dayjs(event.date).format('YYYY年MM月DD日')}
                            </span>
                            {isPublicSchedule(event) && (
                              <span className='flex items-center gap-1'>
                                <UsersIcon className='w-3 h-3' />
                                {joinCount}/{event.recruitCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}

              {events.filter((event) => new Date(event.date) < new Date())
                .length === 0 && (
                <div className='text-sm text-gray-500 text-center py-4'>
                  過去のイベントはありません
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 既存のモーダル類 */}
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
