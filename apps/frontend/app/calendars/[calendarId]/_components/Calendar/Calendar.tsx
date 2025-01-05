'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import dayjs from 'dayjs';
import { dateUtils } from '../../../../../lib/dateUtils';

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
import { useAuth } from '../../../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { client } from '../../../../../lib/api';
import { logger } from '../../../../../lib/logger';

// サブコンポーネントをメモ化
const MemoizedCalendarView = memo(CalendarView);
const MemoizedEventCreation = memo(EventCreation);
const MemoizedPersonalEventCreation = memo(PersonalEventCreation);
const MemoizedEventDetail = memo(EventDetail);
const MemoizedEventTypeSelector = memo(EventTypeSelector);

export const Calendar = memo<CalendarWithRelations>(function Calendar(props) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(() => new Date());
  const {
    calendar,
    publicSchedules,
    personalSchedules,
    setDate: setCalendarDate,
    refresh,
  } = useCalendar(props.id);

  // イベントの表示条件を判定するユーティリティ関数を最適化
  const isVisibleEvent = useCallback(
    (event: CalendarEvent) => {
      if (isPublicSchedule(event)) return true;
      return event.serverUser?.userId === user?.id ? !!event.title : true;
    },
    [user?.id]
  );

  // 自分の個人予定を取得
  const myPersonalSchedules = personalSchedules?.filter(
    (schedule) => schedule.serverUser?.userId === user?.id
  );

  // 月が変更された時の処理を修正
  const handleMonthChange = useCallback(
    (newDate: Date) => {
      if (
        date?.getMonth() !== newDate.getMonth() ||
        date?.getFullYear() !== newDate.getFullYear()
      ) {
        setDate(newDate);
        setCalendarDate(newDate);

        // 次の月のデータをプリフェッチ
        const nextMonth = dateUtils
          .fromUTC(dateUtils.toUTCString(newDate))
          .add(1, 'month');

        queryClient.prefetchQuery({
          queryKey: ['schedules', props.id, nextMonth.format('YYYY-MM')],
          queryFn: () =>
            client.schedules._calendarId(props.id).public.$get({
              query: {
                fromDate: dateUtils.toUTCString(
                  nextMonth.startOf('month').toDate()
                ),
                toDate: dateUtils.toUTCString(
                  nextMonth.endOf('month').toDate()
                ),
              },
            }),
        });
      }
    },
    [date, setCalendarDate, queryClient, props.id]
  );

  // events の計算を最適化
  const events = useMemo(() => {
    const existingIds = new Set(personalSchedules?.map((s) => s.id) || []);
    const otherUsersSchedules = (calendar?.personalSchedules || []).filter(
      (schedule) =>
        !existingIds.has(schedule.id) &&
        schedule.serverUser?.userId !== user?.id &&
        !schedule.isPrivate
    );

    return [
      ...(publicSchedules || []),
      ...(personalSchedules || []),
      ...otherUsersSchedules,
    ];
  }, [
    publicSchedules,
    personalSchedules,
    calendar?.personalSchedules,
    user?.id,
  ]);

  // 初期状態を最適化
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [showPersonalEventCreation, setShowPersonalEventCreation] =
    useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // 空き予定の集計を修正
  const availabilities = useMemo(() => {
    const personalSchedules = events.filter(
      (event): event is PersonalScheduleWithRelations =>
        !isPublicSchedule(event)
    );

    return Object.values(
      personalSchedules.reduce(
        (acc, schedule) => {
          const dateStr = dateUtils.formatToDisplay(
            schedule.date,
            'YYYY-MM-DD'
          );

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
  }, [events]);

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

  // CalendarViewに渡すイベントデータを変換
  const calendarEvents = useMemo(() => {
    logger.log('全イベント', events);
    const filteredEvents = events.filter((event) => {
      // 共有イベントは常に表示（削除済みは除く）
      if (isPublicSchedule(event)) {
        return !event.isDeleted;
      }
      // 個人予定はタイトルがある場合のみ表示
      return !!event.title && event.isPersonal;
    });

    const mappedEvents = filteredEvents.map((event) => {
      const calendarEvent = {
        id: String(event.id),
        start: dateUtils.toCalendarDate(event.date),
        end: dateUtils.toCalendarDate(event.date),
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
      logger.log('変換後のイベント', calendarEvent);
      return calendarEvent;
    });

    return mappedEvents;
  }, [events]);

  // イベント編集ハンドラー
  const handleEventEdit = useCallback((event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEventDetail(false);
  }, []);

  // イベント削除ハンドラーを修正
  const handleEventDelete = useCallback(async () => {
    try {
      logger.log('Calendar: handleEventDelete start');

      // データを更新
      await refresh(date);
      logger.log('Calendar: データ更新完了');
    } catch (error) {
      logger.error('Calendar: エラー発生', error);
    }
  }, [refresh, date]);

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
            calendar={calendar}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
            availabilities={availabilities}
            onMonthChange={handleMonthChange}
            userId={user?.id}
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
                userId={user?.id}
                currentDate={date}
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
                userId={user?.id}
                currentDate={date}
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
            refresh(date);
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
          initialSchedules={myPersonalSchedules}
          onSuccess={() => {
            refresh(date);
            toast({
              title: '個人予定を更新しました',
              description: 'カレンダーを更新しました',
            });
          }}
        />
      )}
      {showEventDetail && selectedEvent && (
        <MemoizedEventDetail
          calendarId={props.id}
          event={selectedEvent}
          onClose={() => setShowEventDetail(false)}
          onEdit={() => handleEventEdit(selectedEvent)}
          onDelete={handleEventDelete}
          onSuccess={() => refresh(date)}
        />
      )}

      {editingEvent && (
        <MemoizedEventCreation
          onClose={() => setEditingEvent(null)}
          date={new Date(editingEvent.date)}
          calendarId={props.id}
          event={editingEvent} // 編集対象のイベント
          onSuccess={() => {
            refresh(date);
            toast({
              title: 'イベントを更新しました',
              description: 'カレンダーを更新しました',
            });
          }}
        />
      )}
    </div>
  );
});

export default Calendar;
