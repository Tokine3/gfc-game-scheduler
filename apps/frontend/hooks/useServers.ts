import useSWR from 'swr';
import { client } from '../lib/api';
import type { ServerWithRelations } from '../apis/@types';
import { logger } from '../lib/logger';

type UseServersReturn = {
  servers: ServerWithRelations[];
  calendarCount: number;
  isError: Error | undefined;
  isLoading: boolean;
  mutate: ReturnType<typeof useSWR<ServerWithRelations[]>>['mutate'];
};

/**
 * @description サーバー一覧を取得・管理するカスタムフック
 */
const fetchServers = async (): Promise<ServerWithRelations[]> => {
  try {
    const response = await client.auth.servers.get();
    const serversData = response.body.data;
    return serversData
      .map((server, index) => ({
        ...server,
        isJoined: server.serverUsers[index]?.isJoined ?? false,
        isFavorite: server.serverUsers[index]?.isFavorite ?? false,
        updatedAt: server.serverUsers[index]?.updatedAt ?? new Date(0).toISOString(),
        calendars: server.calendars,
      }))
      .sort((a, b) => {
        const aFavorite = a.serverUsers[0]?.isFavorite ?? false;
        const bFavorite = b.serverUsers[0]?.isFavorite ?? false;
        if (aFavorite !== bFavorite) return aFavorite ? -1 : 1;

        const aJoined = a.serverUsers[0]?.isJoined ?? false;
        const bJoined = b.serverUsers[0]?.isJoined ?? false;
        return aJoined === bJoined ? 0 : aJoined ? -1 : 1;
      });
  } catch (error) {
    logger.error('Failed to fetch servers:', error);
    throw error;
  }
};

export const useServers = (): UseServersReturn => {
  const {
    data: servers,
    error,
    isLoading,
    mutate,
  } = useSWR<ServerWithRelations[]>('servers', fetchServers, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    servers: servers ?? [],
    calendarCount:
      servers?.reduce((acc, server) => acc + server.calendars.length, 0) ?? 0,
    isError: error,
    isLoading,
    mutate,
  };
};
