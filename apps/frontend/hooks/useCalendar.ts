import useSWR from 'swr';
import { client } from '../lib/api';
import { logger } from '../lib/logger';
import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

export function useCalendar(calendarId: string | undefined) {
  const [date, setDate] = useState(() => new Date());

  const getPublicScheduleKey = useCallback(
    (targetDate: Date) => {
      if (!calendarId) return null;
      const query = {
        fromDate: dayjs(targetDate).startOf('month').utc().format(),
        toDate: dayjs(targetDate).endOf('month').utc().format(),
      };
      return ['/schedules/' + calendarId + '/public', query] as const;
    },
    [calendarId]
  );

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
      return ['/schedules/' + calendarId + '/me/personal', query] as const;
    },
    [calendarId]
  );

  const {
    data,
    error,
    mutate: mutateCalendar,
  } = useSWR(calendarId ? `/calendars/${calendarId}` : null, async () => {
    try {
      const calendar = await client.calendars._id(calendarId!).$get({
        query: {
          fromDate: dayjs(date)
            .startOf('month')
            .subtract(1, 'hour')
            .utc()
            .format(),
          toDate: dayjs(date).endOf('month').add(1, 'hour').utc().format(),
        },
      });

      const hasServerAccess = await client.servers.me.server_user.$get({
        query: {
          serverId: calendar.serverId,
        },
      });

      if (!hasServerAccess) {
        throw new Error('unauthorized');
      }

      return calendar;
    } catch (error) {
      logger.error('Failed to fetch calendar:', error);
      throw error;
    }
  });

  const { data: publicSchedules, mutate: mutatePublic } = useSWR(
    getPublicScheduleKey(date),
    async ([url, params]) => {
      const response = await client.schedules
        ._calendarId(calendarId!)
        .public.$get({
          query: params,
        });
      return response;
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const { data: personalSchedules, mutate: mutatePersonal } = useSWR(
    getPersonalScheduleKey(date),
    async ([url, params]) => {
      const response = await client.schedules
        ._calendarId(calendarId!)
        .me.personal.$get({
          query: params,
        });
      return response;
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const refresh = useCallback(async () => {
    if (!calendarId) return;

    try {
      await Promise.all([
        mutateCalendar(undefined, {
          revalidate: false,
          populateCache: true,
        }),
        mutatePublic(undefined, {
          revalidate: false,
          populateCache: true,
        }),
        mutatePersonal(undefined, {
          revalidate: false,
          populateCache: true,
        }),
      ]);

      Promise.all([mutateCalendar(), mutatePublic(), mutatePersonal()]).catch(
        (error) => {
          logger.error('Failed to refresh calendar in background:', error);
        }
      );
    } catch (error) {
      logger.error('Failed to refresh calendar:', error);
    }
  }, [calendarId, mutateCalendar, mutatePublic, mutatePersonal]);

  return {
    calendar: data,
    publicSchedules,
    personalSchedules,
    isLoading: !error && !data,
    isError: error,
    refresh,
    setDate,
    getPersonalScheduleKey,
  };
}
