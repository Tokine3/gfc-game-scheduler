'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import type { Event } from './Calendar';
import { DateSelectArg, EventContentArg } from '@fullcalendar/core';
import { User, Crosshair } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface CalendarViewProps {
  date: Date | undefined;
  events: Event[];
  onDateSelect: (date: Date | undefined) => void;
  onEventClick: (event: Event) => void;
  onTooltipChange: (tooltip: {
    show: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }) => void;
}

// カスタムボタンコンポーネントを作成
const CalendarButton = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type='button'
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-1',
        'disabled:pointer-events-none disabled:opacity-50',
        'border border-gray-700 bg-gray-800 text-gray-200',
        'hover:bg-gray-700 hover:text-gray-100'
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export function CalendarView({
  date,
  events,
  onDateSelect,
  onEventClick,
  onTooltipChange,
}: CalendarViewProps) {
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

    const tooltipContent = (
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
    );

    const handleMouseEnter = (e: React.MouseEvent) => {
      onTooltipChange({
        show: true,
        x: e.clientX,
        y: e.clientY,
        content: tooltipContent,
      });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      onTooltipChange({
        show: true,
        x: e.clientX,
        y: e.clientY,
        content: tooltipContent,
      });
    };

    const handleMouseLeave = () => {
      onTooltipChange({
        show: false,
        x: 0,
        y: 0,
        content: null,
      });
    };

    return (
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-full',
          'text-xs font-medium shadow-sm backdrop-blur-sm',
          'transition-all duration-200 hover:scale-105',
          isPersonal
            ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
            : isFull
              ? 'bg-green-500/20 text-green-200 border border-green-500/30'
              : 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
        )}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {isPersonal ? (
          <User className='h-3 w-3 flex-shrink-0' />
        ) : (
          <Crosshair className='h-3 w-3 flex-shrink-0' />
        )}
        <span className='truncate'>{eventContent.event.title}</span>
        {!isPersonal && (
          <span className='flex-shrink-0 text-[10px] opacity-80'>
            {eventContent.event.extendedProps.participants}/
            {eventContent.event.extendedProps.quota}
          </span>
        )}
      </div>
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
            click: function (ev, element) {
              const calendar = element
                .closest('.fc')
                ?.querySelector('.fc-prev-button');
              if (calendar) {
                (calendar as HTMLElement).click();
              }
            },
          },
          next: {
            text: '＞',
            click: function (ev, element) {
              const calendar = element
                .closest('.fc')
                ?.querySelector('.fc-next-button');
              if (calendar) {
                (calendar as HTMLElement).click();
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
