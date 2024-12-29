import { useState, useCallback, useEffect } from 'react';
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

type UseCalendarReturn = {
  calendar: CalendarWithRelations | undefined;
  publicSchedules: PublicScheduleWithRelations[] | undefined;
  personalSchedules: PersonalScheduleWithRelations[] | undefined;
  isLoading: boolean;
  isError: Error | null;
  refresh: (date: Date) => Promise<void>;
  setDate: (date: Date) => Promise<void>;
  getPersonalScheduleKey: (
    targetDate: Date
  ) => readonly [string, { fromDate: string; toDate: string }] | null;
};

// カスタムエラークラスを追加
export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export function useCalendar(calendarId: string): UseCalendarReturn {
  const [date, setDate] = useState(() => new Date());
  const queryClient = useQueryClient();

  // カレンダーデータのフェッチを最適化
  const { data: calendar, error } = useQuery({
    queryKey: ['calendar', calendarId, dayjs(date).format('YYYY-MM')],
    queryFn: async () => {
      try {
        return await client.calendars._id(calendarId).$get({
          query: {
            fromDate: dayjs(date).tz('Asia/Tokyo').startOf('month').format(),
            toDate: dayjs(date).tz('Asia/Tokyo').endOf('month').format(),
          },
        });
      } catch (error) {
        logger.error('Calendar fetch error:', error);
        throw error;
      }
    },
    staleTime: 0,
  });

  // データ更新処理を最適化
  const refreshCalendarData = useCallback(
    async (targetDate: Date): Promise<void> => {
      try {
        await queryClient.invalidateQueries({
          queryKey: ['calendar', calendarId],
          refetchType: 'all',
        });

        await queryClient.fetchQuery({
          queryKey: [
            'calendar',
            calendarId,
            dayjs(targetDate).format('YYYY-MM'),
          ],
          queryFn: () =>
            client.calendars._id(calendarId).$get({
              query: {
                fromDate: dayjs(targetDate)
                  .tz('Asia/Tokyo')
                  .startOf('month')
                  .format(),
                toDate: dayjs(targetDate)
                  .tz('Asia/Tokyo')
                  .endOf('month')
                  .format(),
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

  // 月変更時のデータ取得を最適化
  const handleMonthChange = useCallback(
    async (newDate: Date) => {
      setDate(newDate);
      return await refreshCalendarData(newDate);
    },
    [refreshCalendarData]
  );

  const getPersonalScheduleKey = useCallback(
    (targetDate: Date) => {
      if (!calendarId) return null;
      return [
        'personalSchedules',
        {
          fromDate: dayjs(targetDate)
            .tz('Asia/Tokyo')
            .startOf('month')
            .format(),
          toDate: dayjs(targetDate).tz('Asia/Tokyo').endOf('month').format(),
        },
      ] as const;
    },
    [calendarId]
  );

  return {
    calendar,
    publicSchedules: calendar?.publicSchedules ?? [],
    personalSchedules: calendar?.personalSchedules ?? [],
    isLoading: !error && !calendar,
    isError: error,
    refresh: refreshCalendarData, // refreshCalendarDataを直接使用
    setDate: handleMonthChange,
    getPersonalScheduleKey,
  };
}
