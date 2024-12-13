'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import type { Event } from './Calendar';
import { DateSelectArg, EventContentArg } from '@fullcalendar/core';
import { User, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  date: Date | undefined;
  events: Event[];
  onDateSelect: (date: Date | undefined) => void;
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
    const { isPersonal, isFull } = eventContent.event.extendedProps;

    return (
      <div
        className={cn(
          'w-5 h-5 rounded-full flex items-center justify-center',
          isPersonal ? 'bg-purple-500' : isFull ? 'bg-green-500' : 'bg-gray-500'
        )}
        title={eventContent.event.title}
      >
        {isPersonal ? (
          <User className='h-3 w-3 text-white' />
        ) : (
          <Crosshair className='h-3 w-3 text-white' />
        )}
      </div>
    );
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
      />
    </div>
  );
}

export default CalendarView;
