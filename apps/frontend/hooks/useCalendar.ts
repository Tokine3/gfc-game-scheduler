import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/api';
import { logger } from '../lib/logger';
import dayjs from 'dayjs';
import type {
  Calendar,
  CalendarWithRelations,
  PersonalScheduleWithRelations,
  PublicScheduleWithRelations,
} from '../apis/@types';
import { dateUtils } from '../lib/dateUtils';

type UseCalendarReturn = {
  calendar: CalendarWithRelations | undefined;
  publicSchedules: PublicScheduleWithRelations[] | undefined;
  personalSchedules: PersonalScheduleWithRelations[] | undefined;
  isLoading: boolean;
  isError: Error | null;
  refresh: (date: Date) => Promise<void>;
  setDate: (date: Date) => Promise<void>;
};

// カスタムエラークラスを追加
export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export function useCalendar(calendarId: string): UseCalendarReturn {
  // 初期値の設定を改善
  const initialDate = useMemo(() => {
    return dayjs().startOf('month').toDate();
  }, []);

  const [date, setDate] = useState(initialDate);
  const queryClient = useQueryClient();
  const isInitialMount = useRef(true);

  console.log('date', date);

  // カレンダーデータのフェッチを修正
  const { data: calendar, error } = useQuery({
    queryKey: [
      'calendar',
      calendarId,
      dateUtils.formatToDisplay(dateUtils.toUTCString(date), 'YYYY-MM'),
    ],
    queryFn: async () => {
      try {
        // 月初と月末の日付を確実に含むように調整
        const startOfMonth = dayjs(date).startOf('month').toDate();
        const endOfMonth = dayjs(date).endOf('month').toDate();

        // 初期マウント時のみログを出力
        if (isInitialMount.current) {
          console.log('Initial fetch', startOfMonth);
          isInitialMount.current = false;
        }

        return await client.calendars._id(calendarId).$get({
          query: {
            fromDate: dateUtils.toUTCString(startOfMonth),
            toDate: dateUtils.toUTCString(endOfMonth),
          },
        });
      } catch (error) {
        logger.error('Calendar fetch error:', error);
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
  });

  // データ更新処理を最適化
  const refreshCalendarData = useCallback(
    async (targetDate: Date): Promise<void> => {
      console.log('refreshCalendarData', targetDate);
      try {
        const currentMonth = dateUtils.formatToDisplay(
          dateUtils.toUTCString(targetDate),
          'YYYY-MM'
        );

        await queryClient.invalidateQueries({
          queryKey: ['calendar', calendarId, currentMonth],
          refetchType: 'all',
        });

        await queryClient.fetchQuery({
          queryKey: ['calendar', calendarId, currentMonth],
          queryFn: () =>
            client.calendars._id(calendarId).$get({
              query: {
                fromDate: dateUtils.toUTCString(
                  dayjs(targetDate).startOf('month').toDate()
                ),
                toDate: dateUtils.toUTCString(
                  dayjs(targetDate).endOf('month').toDate()
                ),
              },
            }),
        });
      } catch (error) {
        logger.error('Failed to refresh calendar data:', error);
        throw error;
      }
    },
    [calendarId, queryClient]
  );

  // 月変更時のデータ取得を修正
  const handleMonthChange = useCallback(
    async (newDate: Date) => {
      console.log('handleMonthChange', newDate);
      // 必ず月初に設定
      const firstDayOfMonth = dayjs(newDate).startOf('month').toDate();
      const currentMonth = dateUtils.formatToDisplay(
        dateUtils.toUTCString(firstDayOfMonth),
        'YYYY-MM'
      );

      setDate(firstDayOfMonth);

      // 特定の月のクエリのみを無効化して再取得
      await queryClient.invalidateQueries({
        queryKey: ['calendar', calendarId, currentMonth],
        exact: true,
      });

      await queryClient.fetchQuery({
        queryKey: ['calendar', calendarId, currentMonth],
        queryFn: () =>
          client.calendars._id(calendarId).$get({
            query: {
              fromDate: dateUtils.toUTCString(firstDayOfMonth),
              toDate: dateUtils.toUTCString(
                dayjs(firstDayOfMonth).endOf('month').toDate()
              ),
            },
          }),
      });
    },
    [calendarId, queryClient]
  );

  return {
    calendar,
    publicSchedules: calendar?.publicSchedules ?? [],
    personalSchedules: calendar?.personalSchedules ?? [],
    isLoading: !error && !calendar,
    isError: error,
    refresh: refreshCalendarData,
    setDate: handleMonthChange,
  };
}
