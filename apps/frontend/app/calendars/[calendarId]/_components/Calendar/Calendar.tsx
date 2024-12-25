'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { CalendarDays, CrosshairIcon } from 'lucide-react';
import CalendarView from '../CalendarView/CalendarView';
import EventCreation from '../EventCreation/EventCreation';
import PersonalEventCreation from '../PersonalEventCreation/PersonalEventCreation';
import EventDetail from '../EventDetail/EventDetail';
import EventTypeSelector from '../EventTypeSelector/EventTypeSelector';
import {
  CalendarWithRelations,
  PersonalScheduleWithRelations,
} from '../../../../../apis/@types';
import { Availability, CalendarEvent } from './_types/types';
import { isPublicSchedule } from './_utils/utils';
import { ActionBar } from './_components/ActionBar/ActionBar';
import { EventList } from './_components/EventList/EventList';
import { useCalendar } from '../../../../../hooks/useCalendar';
import { toast } from '../../../../components/ui/use-toast';

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

// イベントの表示条件を判定するユーティリティ関数を追加
const isVisibleEvent = (event: CalendarEvent) => {
  if (isPublicSchedule(event)) {
    // 共有イベントは常に表示
    return true;
  }
  // 個人予定はタイトルが設定されている場合のみ表示
  return !isPublicSchedule(event) && !!event.title;
};

export const Calendar = memo<CalendarWithRelations>(function Calendar(props) {
  const [date, setDate] = useState<Date>(() => new Date());
  const {
    calendar,
    publicSchedules,
    personalSchedules,
    setDate: setCalendarDate,
    refresh,
  } = useCalendar(props.id);

  // 月が変更された時
  const handleMonthChange = useCallback(
    (newDate: Date) => {
      if (
        date?.getMonth() !== newDate.getMonth() ||
        date?.getFullYear() !== newDate.getFullYear()
      ) {
        setDate(newDate);
        setCalendarDate(newDate); // これにより新しい月のデータを取得
      }
    },
    [date, setCalendarDate]
  );

  // calendar.publicSchedules と publicSchedules を組み合わせて使用
  const events = useMemo(() => {
    if (!calendar || !publicSchedules) return [];

    // 個人予定と共有イベントを結合
    return [...publicSchedules, ...(personalSchedules || [])];
  }, [publicSchedules, personalSchedules]);

  // 初期状態を最適化
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [showPersonalEventCreation, setShowPersonalEventCreation] =
    useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // 空き予定の集計を最適化
  const availabilities = useMemo(() => {
    // PersonalScheduleのみをフィルタリング
    const personalSchedules = events.filter(
      (event): event is PersonalScheduleWithRelations =>
        !isPublicSchedule(event)
    );

    // 日付ごとの空き予定を集計
    return Object.values(
      personalSchedules.reduce(
        (acc, schedule) => {
          const dateStr = dayjs(schedule.date).format('YYYY-MM-DD');

          if (!acc[dateStr]) {
            acc[dateStr] = {
              date: dateStr,
              count: 0,
              users: [],
            };
          }

          if (schedule.serverUser.isJoined) {
            // isFreeの場合のみカウントとユーザー情報を追加
            if (schedule.isFree) {
              acc[dateStr].count += 1;
              acc[dateStr].users.push({
                id: schedule.serverUser.user.id,
                name: schedule.serverUser.user.name,
                avatar: schedule.serverUser.user.avatar,
                isAvailable: true,
                isJoined: schedule.serverUser.isJoined,
              });
            } else {
              // 予定ありの場合もユーザー情報は保持
              acc[dateStr].users.push({
                id: schedule.serverUser.user.id,
                name: schedule.serverUser.user.name,
                avatar: schedule.serverUser.user.avatar,
                isAvailable: false,
                isJoined: schedule.serverUser.isJoined,
              });
            }
          }
          return acc;
        },
        {} as Record<string, Availability>
      )
    );
  }, [events]); // eventsの変更時のみ再計算

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

  // CalendarViewに渡すイベントデータを変換（表示対象のみに絞り込み）
  const calendarEvents = useMemo(() => {
    return events.filter(isVisibleEvent).map((event) => {
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
          participants: isPublicSchedule(event)
            ? event.participants
            : undefined,
          quota: isPublicSchedule(event) ? event.quota : undefined,
          originalEvent: event,
        },
      };
    });
  }, [events]);

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
            onMonthChange={handleMonthChange}
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
                events={events.filter(isVisibleEvent)}
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
                events={events.filter(isVisibleEvent)}
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
          onSuccess={() => {
            refresh();
            toast({
              title: 'イベントを作成しました',
              description: 'カレンダーを更新しました',
            });
          }}
        />
      )}
      {showPersonalEventCreation && (
        <MemoizedPersonalEventCreation
          onClose={() => setShowPersonalEventCreation(false)}
          date={date}
          calendarId={props.id}
          initialSchedules={personalSchedules}
          onSuccess={() => {
            refresh();
            toast({
              title: '個人予定を更新しました',
              description: 'カレンダーを更新しました',
            });
          }}
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
