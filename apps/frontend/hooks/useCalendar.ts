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
  refresh: () => void;
  setDate: (date: Date) => void;
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

  // クエリキーを定数として定義
  const QUERY_KEYS = {
    calendar: ['calendar', calendarId] as const,
    schedules: [
      'schedules',
      calendarId,
      dayjs(date).format('YYYY-MM'),
    ] as const,
    personalSchedules: [
      'personalSchedules',
      calendarId,
      dayjs(date).format('YYYY-MM'),
    ] as const,
  };

  // カレンダーデータのフェッチを最適化
  const { data: calendar, error } = useQuery({
    queryKey: QUERY_KEYS.calendar,
    queryFn: async () => {
      try {
        const calendar = await client.calendars._id(calendarId).$get({
          query: {
            fromDate: dayjs(date)
              .startOf('month')
              .subtract(1, 'hour')
              .utc()
              .format(),
            toDate: dayjs(date).endOf('month').add(1, 'hour').utc().format(),
          },
        });

        // サーバーアクセスチェックを並列で実行
        const [hasServerAccess] = await Promise.all([
          client.servers.me.server_user.$get({
            query: { serverId: calendar.serverId },
          }),
        ]);

        if (!hasServerAccess) {
          throw new UnauthorizedError();
        }

        return calendar;
      } catch (error) {
        if (error instanceof UnauthorizedError) throw error;
        logger.error('Calendar fetch error:', error);
        throw error;
      }
    },
    staleTime: 30000, // 30秒間はキャッシュを新鮮とみなす
    gcTime: 5 * 60 * 1000, // 5分間キャッシュを保持
  });

  // スケジュールデータのフェッチを最適化
  const { data: publicSchedules } = useQuery({
    queryKey: QUERY_KEYS.schedules,
    queryFn: async () => {
      const response = await client.schedules
        ._calendarId(calendarId)
        .public.$get({
          query: {
            fromDate: dayjs(date).startOf('month').utc().format(),
            toDate: dayjs(date).endOf('month').utc().format(),
          },
        });
      return response;
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    enabled: !!calendar, // カレンダーデータ取得後に実行
  });

  // 個人スケジュールのフェッチを最適化
  const { data: personalSchedules } = useQuery({
    queryKey: QUERY_KEYS.personalSchedules,
    queryFn: async () => {
      const response = await client.schedules
        ._calendarId(calendarId)
        .me.personal.$get({
          query: {
            fromDate: dayjs(date)
              .startOf('month')
              .subtract(1, 'hour')
              .utc()
              .format(),
            toDate: dayjs(date).endOf('month').add(1, 'hour').utc().format(),
          },
        });
      return response;
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    enabled: !!calendar, // カレンダーデータ取得後に実行
  });

  // 最適化されたリフレッシュ関数
  const refresh = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.personalSchedules,
        }),
      ]);
    } catch (error) {
      logger.error('Failed to refresh calendar data:', error);
    }
  }, [queryClient]);

  return {
    calendar,
    publicSchedules,
    personalSchedules,
    isLoading: !error && !calendar,
    isError: error,
    refresh,
    setDate,
    getPersonalScheduleKey: useCallback(
      (targetDate: Date) => {
        if (!calendarId) return null;
        const query = {
          fromDate: dayjs(targetDate)
            .startOf('month')
            .subtract(1, 'hour')
            .utc()
            .format(),
          toDate: dayjs(targetDate)
            .endOf('month')
            .add(1, 'hour')
            .utc()
            .format(),
        };
        return [`/schedules/${calendarId}/me/personal`, query] as const;
      },
      [calendarId]
    ),
  };
}
