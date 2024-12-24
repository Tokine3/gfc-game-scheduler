import useSWR from 'swr';
import { client } from '../lib/api';
import { logger } from '../lib/logger';

export function useCalendar(calendarId: string | undefined) {
  const { data, error, mutate } = useSWR(
    calendarId ? `/calendars/${calendarId}` : null,
    async () => {
      try {
        const [calendar, serverData] = await Promise.all([
          client.calendars._id(calendarId!).$get(),
          client.auth.servers.$get(),
        ]);

        const hasServerAccess = serverData.data.some(
          (s) => s.id === calendar.serverId
        );

        if (!hasServerAccess) {
          throw new Error('unauthorized');
        }

        return calendar;
      } catch (error) {
        logger.error('Failed to fetch calendar:', error);
        throw error;
      }
    }
  );

  return {
    calendar: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
