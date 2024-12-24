'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { client } from '../../lib/api';
import Header from '../components/Header';
import { toast } from '../components/ui/use-toast';
import { motion } from 'framer-motion';
import type { Server } from './types';
import { ServerCard } from './_components/ServerCard/ServerCard';
import { useServers } from './_hooks/useServers';
import { ServersHeader } from './_components/ServersHeader/ServersHeader';
import { CreateCalendarDialog } from './_components/CreateCalendarDialog/CreateCalendarDialog';
import { JoinServerDialog } from './_components/JoinServerDialog/JoinServerDialog';
import { OpenCalendarDialog } from './_components/OpenCalendarDialog/OpenCalendarDialog';
import { Calendar } from '../../apis/@types';
import { LoadingScreen } from '../components/LoadingScreen';

export default function ServersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { servers, setServers, favoriteStates, setFavoriteStates, isLoading } =
    useServers(user?.id ?? null);
  const [showCreateCalendarDialog, setShowCreateCalendarDialog] =
    useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [newCalendarName, setNewCalendarName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [showOpenCalendarDialog, setShowOpenCalendarDialog] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(
    null
  );
  const [selectedServerName, setSelectedServerName] = useState('');

  // 認証チェック
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  const handleCreateCalendar = useCallback((serverId: string) => {
    setSelectedServerId(serverId);
    setShowCreateCalendarDialog(true);
  }, []);

  const handleFavoriteChange = useCallback(
    async (serverId: string, isFavorite: boolean) => {
      try {
        await client.servers.fav._id(serverId).$patch({
          body: { isFavorite },
        });

        setFavoriteStates((prev) => ({
          ...prev,
          [serverId]: isFavorite,
        }));

        toast({
          title: isFavorite ? 'お気に入りに追加' : 'お気に入りから削除',
          description: `${isFavorite ? 'お気に入りに追加' : 'お気に入りから削除'}しました`,
        });
      } catch (error) {
        console.error('Failed to update favorite:', error);
        toast({
          title: 'エラー',
          description: 'お気に入りの更新に失敗しました',
          variant: 'destructive',
        });
      }
    },
    []
  );

  const handleJoinClick = useCallback(async (server: Server) => {
    setSelectedServer(server);
    setShowJoinDialog(true);
    return Promise.resolve();
  }, []);

  const handleJoinServer = useCallback(async (server: Server) => {
    setIsJoining(true);
    try {
      await client.servers.join.$post({
        body: {
          serverId: server.id,
          serverName: server.name,
          serverIcon: server.icon || '',
        },
      });

      setServers((prevServers) =>
        prevServers.map((s) =>
          s.id === server.id ? { ...s, isJoined: true } : s
        )
      );

      toast({
        title: '参加完了',
        description: `${server.name} に参加しました`,
      });
      setShowJoinDialog(false);
    } catch (error) {
      console.error('Failed to join server:', error);
      toast({
        title: 'エラー',
        description: 'サーバーへの参加に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  }, []);

  const handleCreateCalendarSubmit = async () => {
    if (!newCalendarName.trim()) {
      toast({
        title: 'エラー',
        description: 'カレンダー名を入力してください',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedServer = servers.find((s) => s.id === selectedServerId);
      const response = await client.calendars.$post({
        body: {
          name: newCalendarName,
          serverId: selectedServerId,
          serverName: selectedServer?.name || '',
          icon: selectedServer?.icon || null,
        },
      });

      // 新しいカレンダーをサーバーのカレンダーリストに追加
      setServers((prevServers) =>
        prevServers.map((server) =>
          server.id === selectedServerId
            ? {
                ...server,
                calendars: [
                  ...server.calendars,
                  {
                    id: response.id,
                    name: newCalendarName,
                  },
                ],
              }
            : server
        )
      );

      setShowCreateCalendarDialog(false);
      setNewCalendarName('');

      toast({
        title: '作成完了',
        description: 'カレンダーを作成しました',
      });
    } catch (error) {
      console.error('Failed to create calendar:', error);
      toast({
        title: 'エラー',
        description: 'カレンダーの作成に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // カレンダークリック時の処理を最適化
  const handleCalendarClick = useCallback(
    (calendarId: string, serverName: string) => {
      const calendar = servers
        .flatMap((s) => s.calendars)
        .find((c) => c.id === calendarId);

      if (calendar) {
        setSelectedCalendar({
          ...calendar,
          serverId:
            servers.find((s) => s.calendars.some((c) => c.id === calendarId))
              ?.id || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setSelectedServerName(serverName);
        setShowOpenCalendarDialog(true);
      }
    },
    [servers]
  );

  // カレンダーページへの遷移
  const handleOpenCalendar = useCallback(
    (calendarId: string) => {
      router.push(`/calendar/${calendarId}`);
    },
    [router]
  );

  const totalServers = servers.length;
  const joinedServers = servers.filter((server) => server.isJoined).length;

  if (loading) {
    return <LoadingScreen message='認証情報を確認中...' />;
  }

  if (isLoading) {
    return <LoadingScreen message='サーバー情報を読み込み中...' />;
  }

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      <div className='fixed inset-0 z-0 opacity-50'>
        <div className='absolute top-0 -left-4 w-64 h-64 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-lg' />
        <div className='absolute top-0 -right-4 w-64 h-64 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-lg' />
        <div className='absolute -bottom-8 left-20 w-64 h-64 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-lg' />
      </div>

      <Header />

      <main className='flex-1 container mx-auto px-4 pt-24'>
        <motion.div className='space-y-8'>
          <ServersHeader
            totalServers={totalServers}
            joinedServers={joinedServers}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {servers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                isFavorite={favoriteStates[server.id] || false}
                onFavoriteChange={handleFavoriteChange}
                onJoinServer={handleJoinClick}
                onCreateCalendar={handleCreateCalendar}
                onCalendarClick={handleCalendarClick}
              />
            ))}
          </div>
        </motion.div>
      </main>

      <CreateCalendarDialog
        isOpen={showCreateCalendarDialog}
        onClose={() => setShowCreateCalendarDialog(false)}
        calendarName={newCalendarName}
        onCalendarNameChange={setNewCalendarName}
        onSubmit={handleCreateCalendarSubmit}
        isSubmitting={isSubmitting}
      />

      <JoinServerDialog
        isOpen={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        server={selectedServer}
        onConfirm={handleJoinServer}
        isSubmitting={isJoining}
      />

      <OpenCalendarDialog
        isOpen={showOpenCalendarDialog}
        onClose={() => setShowOpenCalendarDialog(false)}
        calendar={selectedCalendar}
        serverName={selectedServerName}
        onConfirm={handleOpenCalendar}
      />

      <footer className='relative z-10 border-t border-gray-800/60 bg-gray-900/95 backdrop-blur-md py-8 mt-12'>
        <div className='container mx-auto px-4'>
          <p className='text-center text-sm text-gray-500'>
            © 2024 GFC Scheduler. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
