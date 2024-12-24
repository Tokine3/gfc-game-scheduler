import useSWR from 'swr';
import { client } from '../lib/api';
import { logger } from '../lib/logger';
import type { GetUserServersResponse } from '../apis/@types';

export function useServers() {
  const { data, error, mutate } = useSWR<GetUserServersResponse>(
    '/servers',
    async () => {
      try {
        const response = await client.auth.servers.$get();
        return response;
      } catch (error) {
        logger.error('Failed to fetch servers:', error);
        throw error;
      }
    }
  );

  return {
    servers: data?.data || [],
    calendarCount: data?.calendarCount || 0,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
