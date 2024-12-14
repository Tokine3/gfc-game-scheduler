'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import type { Event, Participant } from './Calendar';
import { DateSelectArg, EventContentArg } from '@fullcalendar/core';
import { User, Crosshair } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRef, useMemo, useCallback } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import holidays from '@holiday-jp/holiday_jp';

interface CalendarViewProps {
  date: Date | undefined;
  events: {
    id: string;
    start: Date;
    end: Date;
    title: string;
    extendedProps: {
      isPersonal: boolean;
      participants: Participant[] | undefined;
      quota: number | undefined;
      originalEvent: Event;
    };
  }[];
  onDateSelect: (date: Date | undefined) => void;
  onEventClick: (event: Event) => void;
}

interface Holiday {
  date: Date;
  name: string;
}

export function CalendarView({
  date,
  events,
  onDateSelect,
  onEventClick,
}: CalendarViewProps) {
  const calendarRef = useRef<any>(null);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    onDateSelect(selectInfo.start);
  };

  const handleDateClick = (arg: { date: Date }) => {
    onDateSelect(arg.date);
  };

  const renderEventContent = (eventContent: EventContentArg) => {
    const { isPersonal, participants, quota } =
      eventContent.event.extendedProps;
    const isFull =
      participants &&
      quota &&
      participants.filter((p: Participant) => p.status === 'join').length >=
        quota;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex items-center gap-1.5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-full',
                'text-[10px] sm:text-xs font-medium shadow-sm backdrop-blur-sm',
                'transition-all duration-200 hover:scale-105',
                'min-w-0 max-w-full',
                isPersonal
                  ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                  : isFull
                    ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
              )}
            >
              <div className='flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 min-w-0'>
                <div className='flex items-center gap-1 flex-shrink-0'>
                  {isPersonal ? (
                    <User className='h-3 w-3' />
                  ) : (
                    <Crosshair className='h-3 w-3' />
                  )}
                  {!isPersonal && participants && (
                    <span className='text-[9px] sm:text-[10px] opacity-80'>
                      {participants.length}/{quota}
                    </span>
                  )}
                </div>
                <span className='truncate'>{eventContent.event.title}</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side='bottom' className='max-w-xs'>
            <div className='space-y-2'>
              <div className='font-medium'>{eventContent.event.title}</div>
              {!isPersonal && participants && quota && (
                <>
                  <div className='text-gray-400 flex items-center gap-1'>
                    <User className='h-3 w-3' />
                    <span>
                      {participants.length}/{quota}
                    </span>
                  </div>
                  <div className='space-y-1'>
                    {participants.filter(
                      (p: Participant) => p.status === 'join'
                    ).length > 0 && (
                      <div className='text-xs'>
                        <span className='text-green-400 font-medium'>
                          参加者:{' '}
                        </span>
                        {participants
                          .filter((p: Participant) => p.status === 'join')
                          .map((p: Participant) => p.name)
                          .join(', ')}
                      </div>
                    )}
                    {participants.filter(
                      (p: Participant) => p.status === 'maybe'
                    ).length > 0 && (
                      <div className='text-xs'>
                        <span className='text-yellow-400 font-medium'>
                          未定:{' '}
                        </span>
                        {participants
                          .filter((p: Participant) => p.status === 'maybe')
                          .map((p: Participant) => p.name)
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

  const handleEventClick = (clickInfo: any) => {
    const eventId = parseInt(clickInfo.event.id);
    const originalEvent = events.find(
      (e) => e.extendedProps.originalEvent.id === eventId
    );
    if (originalEvent?.extendedProps.originalEvent) {
      onEventClick(originalEvent.extendedProps.originalEvent);
    }
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

  return (
    <div className='w-full h-full'>
      <FullCalendar
        ref={calendarRef}
        locale='ja'
        locales={[jaLocale]}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        selectable={true}
        select={handleDateSelect}
        dateClick={handleDateClick}
        events={events}
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
        customButtons={{
          prev: {
            text: '＜',
            click: () => {
              const calendarApi = calendarRef.current?.getApi();
              if (calendarApi) {
                calendarApi.prev();
              }
            },
          },
          next: {
            text: '＞',
            click: () => {
              const calendarApi = calendarRef.current?.getApi();
              if (calendarApi) {
                calendarApi.next();
              }
            },
          },
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
        eventClick={handleEventClick}
      />
    </div>
  );
}

export default CalendarView;
