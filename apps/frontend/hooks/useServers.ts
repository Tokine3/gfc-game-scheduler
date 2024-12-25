import useSWR from 'swr';
import { client } from '../lib/api';
import { ServerWithRelations } from '../apis/@types';

const fetchServers = async () => {
  const response = await client.auth.servers.get();
  const serversData = response.body.data;

  return serversData
    .map((server, index) => {
      const serverUser = server.serverUsers[index];
      return {
        ...server,
        isJoined: serverUser?.isJoined || false,
        isFavorite: serverUser?.isFavorite || false,
        updatedAt: serverUser?.updatedAt || new Date(0).toISOString(),
        calendars: server.calendars,
      };
    })
    .sort((a, b) => {
      const aFavorite = a.serverUsers[0]?.isFavorite || false;
      const bFavorite = b.serverUsers[0]?.isFavorite || false;
      if (aFavorite !== bFavorite) {
        return aFavorite ? -1 : 1;
      }
      return 0;
    });
};

export const useServers = () => {
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
    servers: servers || [],
    calendarCount:
      servers?.reduce((acc, server) => acc + server.calendars.length, 0) || 0,
    error,
    isLoading,
    mutate,
  };
};
