import { useState, useEffect } from 'react';
import { client } from '../../../lib/api';
import { toast } from '../../components/ui/use-toast';
import type { Server, FavoriteStates } from '../types';

export const useServers = (userId: string | null) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [favoriteStates, setFavoriteStates] = useState<FavoriteStates>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      if (!userId) return;

      try {
        const response = await client.auth.servers.get();
        const serversData = response.body.data;

        const serversWithJoinStatus = serversData.map((server) => {
          const serverUser = server.serverUsers[0];
          return {
            ...server,
            isJoined: server.serverUsers.length > 0,
            isFavorite: serverUser?.isFavorite || false,
            updatedAt: serverUser?.updatedAt || new Date(0).toISOString(),
          };
        });

        const sortedServers = serversWithJoinStatus.sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) {
            return b.isFavorite ? 1 : -1;
          }
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

        setServers(sortedServers);
        setFavoriteStates(
          sortedServers.reduce(
            (acc, server) => ({
              ...acc,
              [server.id]: server.isFavorite,
            }),
            {}
          )
        );
      } catch (error) {
        console.error('Failed to fetch servers:', error);
        toast({
          title: 'エラー',
          description: 'サーバー一覧の取得に失敗しました',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, [userId]);

  return {
    servers,
    setServers,
    favoriteStates,
    setFavoriteStates,
    isLoading,
  };
};
