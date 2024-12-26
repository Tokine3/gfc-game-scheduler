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

  useEffect(() => {
    logger.info('Calendar hook initialized:', {
      calendarId,
      date: date.toISOString(),
    });
  }, [calendarId, date]);

  // クエリキー
  const calendarKey = ['calendar', calendarId];
  const schedulesKey = ['schedules', calendarId, dayjs(date).format('YYYY-MM')];
  const personalSchedulesKey = [
    'personalSchedules',
    calendarId,
    dayjs(date).format('YYYY-MM'),
  ];

  const getPersonalScheduleKey = useCallback(
    (targetDate: Date) => {
      if (!calendarId) return null;
      const query = {
        fromDate: dayjs(targetDate)
          .startOf('month')
          .subtract(1, 'hour')
          .utc()
          .format(),
        toDate: dayjs(targetDate).endOf('month').add(1, 'hour').utc().format(),
      };
      return [`/schedules/${calendarId}/me/personal`, query] as const;
    },
    [calendarId]
  );

  // データフェッチ
  const { data: calendar, error } = useQuery({
    queryKey: calendarKey,
    queryFn: async () => {
      try {
        logger.info('Fetching calendar data:', { calendarId });
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

        logger.info('Checking server access:', { serverId: calendar.serverId });
        const hasServerAccess = await client.servers.me.server_user.$get({
          query: { serverId: calendar.serverId },
        });

        if (!hasServerAccess) {
          logger.error('No server access:', { serverId: calendar.serverId });
          throw new UnauthorizedError(
            `サーバー "${calendar.serverId}" へのアクセス権限がありません`
          );
        }

        logger.info('Calendar data fetched successfully');
        return calendar;
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }
        logger.error('Calendar fetch error:', {
          error,
          calendarId,
          authState: {
            hasDiscordId: !!localStorage.getItem('discord_id'),
            hasDiscordToken: !!localStorage.getItem('discord_token'),
          },
        });
        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: publicSchedules } = useQuery({
    queryKey: schedulesKey,
    queryFn: async () => {
      const response = await client.schedules
        ._calendarId(calendarId)
        .public.$get({
          query: {
            fromDate: dayjs(date)
              .tz('Asia/Tokyo')
              .startOf('month')
              .utc()
              .format(),
            toDate: dayjs(date)
              .tz('Asia/Tokyo')
              .endOf('month')
              .utc()
              .format(),
          },
        });
      return response;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: personalSchedules } = useQuery({
    queryKey: personalSchedulesKey,
    queryFn: async () => {
      const response = await client.schedules
        ._calendarId(calendarId)
        .me.personal.$get({
          query: {
            fromDate: dayjs(date)
              .tz('Asia/Tokyo')
              .startOf('month')
              .subtract(1, 'hour')
              .utc()
              .format(),
            toDate: dayjs(date)
              .tz('Asia/Tokyo')
              .endOf('month')
              .add(1, 'hour')
              .utc()
              .format(),
          },
        });
      return response;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });

  // 最適化されたリフレッシュ関数
  const refresh = useCallback(async () => {
    try {
      // すべてのクエリを無効化
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: calendarKey }),
        queryClient.invalidateQueries({ queryKey: schedulesKey }),
        queryClient.invalidateQueries({ queryKey: personalSchedulesKey }),
      ]);

      // すべてのクエリを再フェッチ
      await Promise.all([
        queryClient.refetchQueries({ queryKey: calendarKey }),
        queryClient.refetchQueries({ queryKey: schedulesKey }),
        queryClient.refetchQueries({ queryKey: personalSchedulesKey }),
      ]);
    } catch (error) {
      logger.error('Failed to refresh calendar data:', error);
    }
  }, [queryClient, calendarKey, schedulesKey, personalSchedulesKey]);

  return {
    calendar,
    publicSchedules,
    personalSchedules,
    isLoading: !error && !calendar,
    isError: error,
    refresh,
    setDate,
    getPersonalScheduleKey,
  };
}
