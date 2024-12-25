import useSWR from 'swr';
import { client } from '../lib/api';
import { logger } from '../lib/logger';

export function useServerMembership(serverId: string | undefined) {
  const { data, error, mutate } = useSWR(serverId ?? null, async () => {
    try {
      const serverUser = await client.servers.me.server_user.$get({
        query: { serverId: serverId! },
      });
      return serverUser;
    } catch (error) {
      logger.error('Failed to fetch server membership:', error);
      throw error;
    }
  });

  return {
    isMember: !!data,
    isLoading: !error && !data,
    refresh: mutate,
  };
}
