'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import type { Event } from './Calendar';
import { DateSelectArg, EventContentArg } from '@fullcalendar/core';
import { User, Crosshair } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface CalendarViewProps {
  date: Date | undefined;
  events: Event[];
  onDateSelect: (date: Date | undefined) => void;
  onEventClick: (event: Event) => void;
}

export function CalendarView({
  date,
  events,
  onDateSelect,
  onEventClick,
}: CalendarViewProps) {
  const calendarRef = useRef<any>(null);

  const calendarEvents = events.map((event) => ({
    id: String(event.id),
    start: event.date,
    end: event.date,
    title: event.title,
    extendedProps: {
      isPersonal: event.isPersonal,
      isFull: event.participants === event.quota,
      participants: event.participants,
      quota: event.quota,
    },
  }));

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    onDateSelect(selectInfo.start);
  };

  const renderEventContent = (eventContent: EventContentArg) => {
    const { isPersonal, isFull, participants, quota } =
      eventContent.event.extendedProps;

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
                  {!isPersonal && (
                    <span className='text-[9px] sm:text-[10px] opacity-80'>
                      {participants}/{quota}
                    </span>
                  )}
                </div>
                <span className='truncate'>{eventContent.event.title}</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side='bottom'>
            <div className='space-y-1'>
              <div className='font-medium'>{eventContent.event.title}</div>
              {!isPersonal && (
                <div className='text-gray-400 flex items-center gap-1'>
                  <User className='h-3 w-3' />
                  <span>
                    {participants}/{quota}
                  </span>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const handleEventClick = (clickInfo: any) => {
    const eventId = parseInt(clickInfo.event.id);
    const event = events.find((e) => e.id === eventId);
    if (event) {
      onEventClick(event);
    }
  };

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
        events={calendarEvents}
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
        dayCellClassNames='min-h-[120px]'
        eventClick={handleEventClick}
      />
    </div>
  );
}

export default CalendarView;
