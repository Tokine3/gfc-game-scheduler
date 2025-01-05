'use client';

import { FC, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ServerWithRelations } from '../../../../apis/@types';
import { ServerCard } from '../ServerCard/ServerCard';
import { client } from '../../../../lib/api';
import { logger } from '../../../../lib/logger';
import { toast } from '../../../components/ui/use-toast';
import { useServers } from '../../../../hooks/useServers';
import { JoinServerDialog } from '../JoinServerDialog/JoinServerDialog';
import { CreateCalendarDialog } from '../CreateCalendarDialog/CreateCalendarDialog';
import { ServersHeader } from '../ServersHeader/ServersHeader';
import { EmptyState } from '../EmptyState/EmptyState';

type Props = {
  servers: ServerWithRelations[];
  calendarCount: number;
};

export const ServerList: FC<Props> = ({ servers }) => {
  const router = useRouter();
  const { mutate } = useServers();
  const [activeTab, setActiveTab] = useState<'joined' | 'all'>('joined');
  const [joiningServer, setJoiningServer] =
    useState<ServerWithRelations | null>(null);
  const [creatingCalendarServer, setCreatingCalendarServer] =
    useState<ServerWithRelations | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isCreatingCalendar, setIsCreatingCalendar] = useState(false);

  logger.log('servers', servers);

  const filteredServers = useMemo(() => {
    return activeTab === 'joined'
      ? servers.filter((server) => server.serverUsers[0]?.isJoined)
      : servers;
  }, [servers, activeTab]);

  const handleFavoriteChange = async (
    serverId: string,
    servers: ServerWithRelations[],
    isFavorite: boolean
  ) => {
    try {
      await client.servers.fav._id(serverId).$patch({
        body: { isFavorite, serversList: servers },
      });
      await mutate();
    } catch (error) {
      logger.error('Failed to update favorite:', error);
      toast({
        title: 'お気に入りの更新に失敗しました',
        variant: 'destructive',
      });
    }
  };

  const handleJoinServer = (server: ServerWithRelations) => {
    setJoiningServer(server);
  };

  const handleCreateCalendar = (serverId: string) => {
    const server = servers.find((s) => s.id === serverId);
    if (server) {
      setCreatingCalendarServer(server);
    }
  };

  const handleCreateCalendarConfirm = async (name: string) => {
    if (!creatingCalendarServer) return;

    try {
      setIsCreatingCalendar(true);
      await client.calendars.$post({
        body: {
          name,
          serverId: creatingCalendarServer.id,
          serverName: creatingCalendarServer.name,
          icon: creatingCalendarServer.icon,
        },
      });

      await mutate();
      setCreatingCalendarServer(null);

      toast({
        title: 'カレンダーを作成しました',
        description: `${name}を作成しました`,
      });
    } catch (error) {
      logger.error('Failed to create calendar:', error);
      toast({
        title: 'カレンダーの作成に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingCalendar(false);
    }
  };

  const handleJoinConfirm = async () => {
    if (!joiningServer) return;

    try {
      setIsJoining(true);
      await client.servers.join.$post({
        body: {
          serverId: joiningServer.id,
          serverName: joiningServer.name,
          serverIcon: joiningServer.icon || '',
        },
      });

      await mutate();
      setJoiningServer(null);

      toast({
        title: 'サーバーに参加しました',
        description: `${joiningServer.name}に参加しました`,
      });
    } catch (error) {
      logger.error('Failed to join server:', error);
      toast({
        title: 'サーバーへの参加に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const totalServers = servers.length;
  const joinedServers = servers.filter(
    (server) => server.serverUsers[0]?.isJoined
  ).length;

  return (
    <>
      <div className='space-y-8'>
        <ServersHeader
          totalServers={totalServers}
          joinedServers={joinedServers}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'joined' && filteredServers.length === 0 ? (
          <EmptyState onShowAll={() => setActiveTab('all')} />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredServers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                servers={servers}
                isFavorite={server.serverUsers?.[0]?.isFavorite || false}
                onFavoriteChange={handleFavoriteChange}
                onJoinServer={handleJoinServer}
                onCreateCalendar={handleCreateCalendar}
                onCalendarClick={(calendarId) =>
                  router.push(`/calendars/${calendarId}`)
                }
              />
            ))}
          </div>
        )}
      </div>

      <JoinServerDialog
        server={joiningServer}
        isOpen={!!joiningServer}
        onClose={() => setJoiningServer(null)}
        onConfirm={handleJoinConfirm}
        isSubmitting={isJoining}
      />

      <CreateCalendarDialog
        server={creatingCalendarServer}
        isOpen={!!creatingCalendarServer}
        onClose={() => setCreatingCalendarServer(null)}
        onConfirm={handleCreateCalendarConfirm}
        isSubmitting={isCreatingCalendar}
      />
    </>
  );
};
