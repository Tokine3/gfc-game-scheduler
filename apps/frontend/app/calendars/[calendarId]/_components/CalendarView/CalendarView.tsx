'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { DateSelectArg, EventContentArg } from '@fullcalendar/core';
import { User, Crosshair, UserCircle2, Lock } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip';
import holidays from '@holiday-jp/holiday_jp';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { debounce, rafThrottle } from '../../../../../lib/utils';
import {
  Availability,
  CalendarEvent,
  isPublicSchedule,
} from '../Calendar/_types/types';
import {
  CalendarWithRelations,
  ParticipantWithRelations,
} from '../../../../../apis/@types';
import { dateUtils } from '../../../../../lib/dateUtils';

interface CalendarViewProps {
  date: Date | undefined;
  events: {
    id: string;
    start: Date;
    end: Date;
    title: string;
    extendedProps: {
      isPersonal: boolean;
      participants: ParticipantWithRelations[] | undefined;
      quota: number | undefined;
      originalEvent: CalendarEvent;
    };
  }[];
  availabilities: Availability[];
  calendar: CalendarWithRelations | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onEventClick: (event: CalendarEvent) => void;
  onMonthChange: (date: Date) => void;
  userId: string | undefined;
}

interface Holiday {
  date: Date;
  name: string;
}

const AvailableUsers = dynamic(
  () => import('../AvailableUsers/AvailableUsers'),
  {
    loading: () => null,
    ssr: false,
  }
);

export function CalendarView({
  date,
  events,
  availabilities,
  calendar,
  onDateSelect,
  onEventClick,
  onMonthChange,
  userId,
}: CalendarViewProps) {
  console.log('CalendarViewが受け取ったイベント', events);
  const calendarRef = useRef<any>(null);
  const lastTapRef = useRef<number>(0);
  const [selectedAvailability, setSelectedAvailability] =
    useState<Availability | null>(null);

  const handleDateSelect = useCallback(
    debounce((selectInfo: DateSelectArg) => {
      if (
        (selectInfo.jsEvent?.target as Element)?.closest('.availability-count')
      ) {
        return;
      }
      onDateSelect(selectInfo.start);
    }, 100),
    [onDateSelect]
  );

  const handleDateClick = (arg: { date: Date; jsEvent: MouseEvent }) => {
    if ((arg.jsEvent.target as Element).closest('.availability-count')) {
      return;
    }

    if (selectedAvailability) return;

    const now = Date.now();
    const DELAY = 200;

    if (now - lastTapRef.current > DELAY) {
      lastTapRef.current = now;
      setTimeout(() => {
        onDateSelect(arg.date);
      }, 100);
    }
  };

  const renderEventContent = (eventContent: EventContentArg) => {
    console.log('renderEventContent', {
      event: eventContent.event,
      timeText: eventContent.timeText,
      isStart: eventContent.isStart,
      isEnd: eventContent.isEnd,
      extendedProps: eventContent.event.extendedProps,
    });

    const { isPersonal, participants, quota, originalEvent } =
      eventContent.event.extendedProps;
    const isFull =
      participants &&
      quota &&
      participants.filter((p: ParticipantWithRelations) => p.reaction === 'OK')
        .length >= quota;
    const isOwnPersonalSchedule =
      !isPublicSchedule(originalEvent) &&
      originalEvent.serverUser?.userId === userId;
    const isDeleted =
      isPublicSchedule(originalEvent) && originalEvent.isDeleted;
    const isPrivate = isOwnPersonalSchedule && originalEvent.isPrivate;
    const joinCount = participants?.filter(
      (p: ParticipantWithRelations) => p.reaction === 'OK'
    ).length;
    const pendingCount = participants?.filter(
      (p: ParticipantWithRelations) => p.reaction === 'PENDING'
    ).length;
    const ngCount = participants?.filter(
      (p: ParticipantWithRelations) => p.reaction === 'NG'
    ).length;

    const handleEventClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // 日付セルのクリックイベントを防ぐ
      if (originalEvent) {
        onEventClick(originalEvent);
      }
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handleEventClick}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md',
                'text-xs font-medium shadow-lg backdrop-blur-sm',
                'transition-all duration-200 hover:scale-105 hover:shadow-xl',
                'border border-opacity-30',
                isPublicSchedule(originalEvent)
                  ? isFull
                    ? 'bg-green-500/20 text-green-200 border-green-500/30 hover:bg-green-500/30'
                    : 'bg-blue-500/20 text-blue-200 border-blue-500/30 hover:bg-blue-500/30'
                  : isOwnPersonalSchedule
                    ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30 hover:bg-indigo-500/30'
                    : 'bg-purple-500/20 text-purple-200 border-purple-500/30 hover:bg-purple-500/30'
              )}
            >
              <div className='flex items-center justify-between w-full gap-1.5'>
                <div className='flex items-center gap-1.5 min-w-0'>
                  <div className='flex items-center gap-1 flex-shrink-0'>
                    {isPublicSchedule(originalEvent) ? (
                      <Crosshair className='h-3 w-3' />
                    ) : isOwnPersonalSchedule ? (
                      <User className='h-3 w-3' />
                    ) : (
                      <UserCircle2 className='h-3 w-3' />
                    )}
                    {!isPersonal && (
                      <span className='text-[9px] sm:text-[10px] opacity-80'>
                        {joinCount}/{quota}
                      </span>
                    )}
                  </div>
                  <span className='truncate'>{eventContent.event.title}</span>
                </div>
                {isPrivate && (
                  <Lock className='h-3 w-3 flex-shrink-0 ml-1 opacity-75' />
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side='bottom' className='bg-gray-800 border-gray-700'>
            <div className='space-y-2'>
              <div className='font-medium'>{`${eventContent.event.title}（${isOwnPersonalSchedule ? '自分' : eventContent.event.extendedProps.originalEvent.serverUser?.user?.name}）`}</div>
              {!isPersonal && (
                <>
                  <div className='text-gray-400 flex items-center gap-1'>
                    <User className='h-3 w-3' />
                    <span>
                      {joinCount}/{quota}
                    </span>
                  </div>
                  <div className='space-y-1'>
                    {joinCount > 0 && (
                      <div className='text-xs'>
                        <span className='text-green-400 font-medium'>
                          参加者:{' '}
                        </span>
                        {participants
                          .filter(
                            (p: ParticipantWithRelations) => p.reaction === 'OK'
                          )
                          .map(
                            (p: ParticipantWithRelations) =>
                              p.serverUser?.user?.name
                          )
                          .join(', ')}
                      </div>
                    )}
                    {pendingCount > 0 && (
                      <div className='text-xs'>
                        <span className='text-yellow-400 font-medium'>
                          未定:{' '}
                        </span>
                        {participants
                          .filter(
                            (p: ParticipantWithRelations) =>
                              p.reaction === 'PENDING'
                          )
                          .map(
                            (p: ParticipantWithRelations) =>
                              p.serverUser?.user?.name
                          )
                          .join(', ')}
                      </div>
                    )}
                    {ngCount > 0 && (
                      <div className='text-xs'>
                        <span className='text-red-400 font-medium'>
                          不参加:{' '}
                        </span>
                        {participants
                          .filter(
                            (p: ParticipantWithRelations) => p.reaction === 'NG'
                          )
                          .map(
                            (p: ParticipantWithRelations) =>
                              p.serverUser?.user?.name
                          )
                          .join(', ')}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const holidayList = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const start = new Date(currentYear, 0, 1); // 現在の年の1月1日
    const end = new Date(currentYear + 1, 2, 31); // 来年の3月31日
    return holidays.between(start, end);
  }, []);

  const dayCellClassNames = useCallback(
    (arg: { date: Date }) => {
      const isHoliday = holidayList.some(
        (holiday: Holiday) =>
          holiday.date.toDateString() === arg.date.toDateString()
      );
      return cn('min-h-[120px]', isHoliday && 'holiday');
    },
    [holidayList]
  );

  const dayCellContent = (arg: { date: Date; dayNumberText: string }) => {
    const availability = availabilities.find((a) => {
      // 両方の日付を日本時間に変換して比較
      const availabilityDate = dateUtils.fromUTC(a.date).format('YYYY-MM-DD');
      const cellDate = dayjs(arg.date).tz('Asia/Tokyo').format('YYYY-MM-DD');
      return availabilityDate === cellDate;
    });

    const count = availability?.count || 0;
    const users = availability?.users || [];

    const colorClass =
      count === 0
        ? 'text-gray-500'
        : count < 5
          ? 'text-amber-200'
          : 'text-emerald-300';

    return {
      html: `
        <div class="h-full flex flex-col">
          <div class="text-right p-1">${arg.dayNumberText}</div>
          <div class="flex-1 flex items-center justify-center">
            <div class="flex items-center gap-1 ${colorClass} text-lg font-medium ${
              count > 0 ? 'cursor-pointer availability-count' : ''
            }" ${count > 0 ? `data-date="${dateUtils.toUTCString(arg.date)}"` : ''}>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ${count}
            </div>
          </div>
        </div>
      `,
    };
  };

  const handleAvailabilityClick = useCallback(
    rafThrottle((e: MouseEvent) => {
      const availabilityCount = (e.target as Element).closest(
        '.availability-count'
      );
      if (availabilityCount) {
        e.stopPropagation();
        e.preventDefault();
        const dateStr = availabilityCount.getAttribute('data-date');
        if (dateStr) {
          const date = new Date(dateStr);
          const availability = availabilities.find(
            (a) =>
              dateUtils.formatToDisplay(a.date, 'YYYY-MM-DD') ===
              dateUtils.formatToDisplay(
                dateUtils.toUTCString(date),
                'YYYY-MM-DD'
              )
          );
          if (availability) {
            setSelectedAvailability({
              date: dateUtils.formatToDisplay(
                dateUtils.toUTCString(date),
                'YYYY-MM-DD'
              ),
              count: availability.count,
              users: availability.users.map((user) => ({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                isAvailable: user.isAvailable,
                isJoined: user.isJoined,
              })),
            });
          }
        }
        return false;
      }
    }),
    [availabilities]
  );

  useEffect(() => {
    document.addEventListener('click', handleAvailabilityClick, true);
    return () =>
      document.removeEventListener('click', handleAvailabilityClick, true);
  }, [handleAvailabilityClick]);

  // イベントをフィルタリング
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const originalEvent = event.extendedProps?.originalEvent;
      // 共有イベントの場合、削除済みは表示しない
      if (originalEvent && isPublicSchedule(originalEvent)) {
        return !originalEvent.isDeleted;
      }
      // 個人予定はそのまま表示
      return true;
    });
  }, [events]);

  // 前回の日付を保持するref
  const previousDateRef = useRef<string>();

  const handleMonthChange = useCallback(
    (date: Date) => {
      const debouncedUpdate = debounce((targetDate: Date) => {
        const firstDayOfMonth = dateUtils
          .fromUTC(dateUtils.toUTCString(targetDate))
          .startOf('month')
          .toDate();

        const currentMonthKey = dateUtils.formatToDisplay(
          dateUtils.toUTCString(firstDayOfMonth),
          'YYYY-MM'
        );

        if (previousDateRef.current === currentMonthKey) {
          return;
        }

        previousDateRef.current = currentMonthKey;
        onMonthChange(firstDayOfMonth);
      }, 100);

      debouncedUpdate(date);
    },
    [onMonthChange]
  );

  // datesSetイベントハンドラを最適化
  const handleDatesSet = useCallback(
    (dateInfo: { view: { currentStart: Date } }) => {
      const targetDate = dayjs.utc(dateInfo.view.currentStart).toDate();
      handleMonthChange(targetDate);
    },
    [handleMonthChange]
  );

  return (
    <div className='w-full h-full'>
      <style jsx global>{`
        .fc {
          --fc-border-color: rgba(75, 85, 99, 0.3);
          --fc-today-bg-color: rgba(139, 92, 246, 0.05);
          --fc-neutral-bg-color: rgba(31, 41, 55, 0.5);
          --fc-list-event-hover-bg-color: rgba(139, 92, 246, 0.1);
          --fc-theme-standard-border-color: var(--fc-border-color);
        }
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: var(--fc-border-color);
        }
        .fc .fc-day-today {
          background: var(--fc-today-bg-color) !important;
          backdrop-filter: blur(8px);
        }
        .fc-day-header {
          background: var(--fc-neutral-bg-color);
          backdrop-filter: blur(8px);
        }
        .fc-event {
          cursor: pointer;
        }
        .holiday {
          background-color: rgba(239, 68, 68, 0.05);
        }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        locale='ja'
        locales={[jaLocale]}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        selectable={true}
        select={handleDateSelect}
        dateClick={handleDateClick}
        events={filteredEvents}
        eventContent={renderEventContent}
        headerToolbar={{
          start: 'title',
          center: '',
          end: 'prev,next',
        }}
        buttonText={{
          today: '今日',
          month: '月',
          prev: '＜',
          next: '＞',
        }}
        height='auto'
        dayMaxEvents={4}
        firstDay={0}
        fixedWeekCount={false}
        selectMirror={true}
        unselectAuto={false}
        eventDisplay='block'
        displayEventTime={false}
        nowIndicator={true}
        initialDate={date}
        dayCellClassNames={dayCellClassNames}
        dayHeaderClassNames='!cursor-default hover:!bg-transparent'
        dayCellContent={dayCellContent}
        datesSet={handleDatesSet}
      />
      {selectedAvailability && (
        <AvailableUsers
          personalSchedules={calendar?.personalSchedules || []}
          date={selectedAvailability.date}
          onClose={() => setSelectedAvailability(null)}
        />
      )}
    </div>
  );
}

export default CalendarView;
