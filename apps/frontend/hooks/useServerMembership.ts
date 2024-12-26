import useSWR from 'swr';
import { client } from '../lib/api';
import { logger } from '../lib/logger';

type UseServerMembershipReturn = {
  isMember: boolean | undefined;
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
  const { data, error, mutate } = useSWR(
    serverId ? `/servers/me/server_user?serverId=${serverId}` : null,
    async () => {
      try {
        return await client.servers.me.server_user.$get({
          query: { serverId: serverId! },
        });
      } catch (error: any) {
        if (error.status === 404) return null;
        throw error;
      }
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  return {
    isMember: data === undefined ? undefined : !!data,
    isLoading: !error && !data,
    refresh: async () => {
      await mutate();
    },
  };
}
