import useSWR from 'swr';
import { client } from '../lib/api';
import { logger } from '../lib/logger';

type UseServerMembershipReturn = {
  isMember: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

/**
 * @description サーバーメンバーシップを管理するカスタムフック
 * @param serverId - サーバーID
 */
export function useServerMembership(
  serverId: string | undefined
): UseServerMembershipReturn {
  const { data, error, mutate } = useSWR<boolean>(
    serverId ? serverId : null,
    async (id: string) => {
      try {
        const serverUser = await client.servers.me.server_user.$get({
          query: { serverId: id },
        });
        return !!serverUser;
      } catch (error) {
        logger.error('Failed to fetch server membership:', {
          error,
          serverId: id,
        });
        throw error;
      }
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  return {
    isMember: !!data,
    isLoading: !error && !data,
    refresh: async () => {
      await mutate();
    },
  };
}
