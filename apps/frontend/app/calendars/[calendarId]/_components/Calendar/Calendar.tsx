'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { CalendarDays, CrosshairIcon } from 'lucide-react';
import CalendarView from '../CalendarView/CalendarView';
import EventCreation from '../EventCreation/EventCreation';
import PersonalEventCreation from '../PersonalEventCreation/PersonalEventCreation';
import EventDetail from '../EventDetail/EventDetail';
import EventTypeSelector from '../EventTypeSelector/EventTypeSelector';
import { CalendarWithRelations } from '../../../../../apis/@types';
import { Availability, CalendarEvent } from './_types/types';
import { client } from '../../../../../lib/api';
import { logger } from '../../../../../lib/logger';
import { isPublicSchedule } from './_utils/utils';
import { ActionBar } from './_components/ActionBar/ActionBar';
import { EventList } from './_components/EventList/EventList';

// プラグインを追加
dayjs.extend(utc);
dayjs.extend(timezone);
// タイムゾーンを日本に設定
dayjs.tz.setDefault('Asia/Tokyo');

// サブコンポーネントをメモ化
const MemoizedCalendarView = memo(CalendarView);
const MemoizedEventCreation = memo(EventCreation);
const MemoizedPersonalEventCreation = memo(PersonalEventCreation);
const MemoizedEventDetail = memo(EventDetail);
const MemoizedEventTypeSelector = memo(EventTypeSelector);

export const Calendar = memo<CalendarWithRelations>(function Calendar(props) {
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

  // デバッグログを追加
  console.log('Calendar props:', {
    id: props.id,
    name: props.name,
    serverId: props.serverId,
  });

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

  // イベントの取得をメモ化
  const fetchEvents = useCallback(async () => {
    try {
      const currentDate = date ?? new Date();
      const response = await client.schedules
        ._calendarId(props.id)
        .all_schedules.$get({
          query: {
            fromDate: dayjs(currentDate)
              .startOf('month')
              .subtract(1, 'hour')
              .utc()
              .format(),
            toDate: dayjs(currentDate)
              .endOf('month')
              .add(1, 'hour')
              .utc()
              .format(),
          },
        });
      setEvents([...response.personalSchedules, ...response.publicSchedules]);
    } catch (error) {
      logger.error('Failed to fetch events:', error);
    }
  }, [props.id, date]);

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
  const calendarEvents = events.map((event) => {
    // 日付を日本時間の0時に設定
    const eventDate = dayjs(event.date)
      .tz('Asia/Tokyo')
      .startOf('day')
      .toDate();

    return {
      id: String(event.id),
      start: eventDate,
      end: eventDate,
      title: event.title,
      extendedProps: {
        isPersonal: event.isPersonal,
        participants: isPublicSchedule(event) ? event.participants : undefined,
        quota: isPublicSchedule(event) ? event.quota : undefined,
        originalEvent: event,
      },
    };
  });

  return (
    <div className='space-y-6'>
      <ActionBar
        onEventCreate={() => setShowEventCreation(true)}
        onPersonalEventCreate={() => setShowPersonalEventCreation(true)}
      />

      <div className='grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6'>
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 overflow-hidden'>
          <MemoizedCalendarView
            events={calendarEvents}
            date={date}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
            availabilities={availabilities}
            onMonthChange={useCallback(
              (newDate: Date) => {
                if (
                  date?.getMonth() !== newDate.getMonth() ||
                  date?.getFullYear() !== newDate.getFullYear()
                ) {
                  setDate(newDate);
                }
              },
              [date]
            )}
          />
        </div>

        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50'>
          <div className='lg:sticky lg:top-32 max-h-[calc(100vh-8rem)] overflow-y-auto'>
            <div className='p-4 border-b border-gray-700/50 bg-gray-800/95 backdrop-blur-sm sticky top-0 z-10'>
              <h3 className='text-lg font-semibold text-gray-100 flex items-center gap-2'>
                <CrosshairIcon className='w-5 h-5 text-purple-400' />
                今後のイベント
              </h3>
            </div>

            <div className='p-4'>
              <EventList
                events={events}
                onEventClick={handleEventClick}
                type='upcoming'
              />
            </div>

            <div className='p-4 border-t border-b border-gray-700/50 bg-gray-800/95 backdrop-blur-sm sticky top-0 z-10'>
              <h3 className='text-lg font-semibold text-gray-100 flex items-center gap-2'>
                <CalendarDays className='w-5 h-5 text-gray-400' />
                過去のイベント
              </h3>
            </div>

            <div className='p-4'>
              <EventList
                events={events}
                onEventClick={handleEventClick}
                type='past'
              />
            </div>
          </div>
        </div>
      </div>

      {/* モーダルコンポーネント */}
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
          calendarId={props.id}
        />
      )}
      {showPersonalEventCreation && (
        <MemoizedPersonalEventCreation
          onClose={() => setShowPersonalEventCreation(false)}
          date={date}
          calendarId={props.id}
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

export default Calendar;
