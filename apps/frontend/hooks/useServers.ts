import useSWR from 'swr';
import { client } from '../lib/api';
import type { ServerWithRelations } from '../apis/@types';

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
  const response = await client.auth.servers.get();
  const serversData = response.body.data;

  return serversData
    .map((server, index) => {
      const serverUser = server.serverUsers[index];
      return {
        ...server,
        isJoined: serverUser?.isJoined ?? false,
        isFavorite: serverUser?.isFavorite ?? false,
        updatedAt: serverUser?.updatedAt ?? new Date(0).toISOString(),
        calendars: server.calendars,
      };
    })
    .sort((a, b) => {
      const aFavorite = a.serverUsers[0]?.isFavorite ?? false;
      const bFavorite = b.serverUsers[0]?.isFavorite ?? false;
      return aFavorite === bFavorite ? 0 : aFavorite ? -1 : 1;
    });
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
