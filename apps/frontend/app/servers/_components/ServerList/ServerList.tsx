'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { ServerWithRelations } from '../../../../apis/@types';
import { ServerCard } from '../ServerCard/ServerCard';
import { client } from '../../../../lib/api';
import { logger } from '../../../../lib/logger';
import type { Server } from '../../types';

type Props = {
  servers: ServerWithRelations[];
  calendarCount: number;
};

export const ServerList: FC<Props> = ({ servers }) => {
  const router = useRouter();

  const handleFavoriteChange = async (
    serverId: string,
    isFavorite: boolean
  ) => {
    try {
      await client.servers.fav._id(serverId).$patch({
        body: {
          isFavorite,
        },
      });
    } catch (error) {
      logger.error('Failed to update favorite:', error);
    }
  };

  const handleJoinServer = async (server: Server) => {
    try {
      await client.servers.join.$post({
        body: {
          serverId: server.id,
          serverName: server.name,
          serverIcon: server.icon || '',
        },
      });
      window.location.reload();
    } catch (error) {
      logger.error('Failed to join server:', error);
    }
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {servers.map((server) => (
        <ServerCard
          key={server.id}
          server={server}
          isFavorite={server.serverUsers?.[0]?.isFavorite || false}
          onFavoriteChange={handleFavoriteChange}
          onJoinServer={handleJoinServer}
          onCreateCalendar={(serverId) =>
            router.push(`/calendars/new?serverId=${serverId}`)
          }
          onCalendarClick={(calendarId) =>
            router.push(`/calendars/${calendarId}`)
          }
        />
      ))}
    </div>
  );
};
