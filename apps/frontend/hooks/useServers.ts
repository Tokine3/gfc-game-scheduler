import useSWR from 'swr';
import { client } from '../lib/api';
import { logger } from '../lib/logger';
import type { GetUserServersResponse } from '../apis/@types';

const SERVERS_CACHE_KEY = '/servers';

export function useServers() {
  const { data, error, mutate } = useSWR<GetUserServersResponse>(
    SERVERS_CACHE_KEY,
    async () => {
      try {
        const response = await client.auth.servers.$get();
        return response;
      } catch (error) {
        logger.error('Failed to fetch servers:', error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 0,
    }
  );

  const refresh = async () => {
    try {
      const newData = await client.auth.servers.$get();
      await mutate(newData, false); // optimistic update
    } catch (error) {
      logger.error('Failed to refresh servers:', error);
      throw error;
    }
  };

  return {
    servers: data?.data || [],
    calendarCount: data?.calendarCount || 0,
    isLoading: !error && !data,
    isError: error,
    refresh,
  };
}
