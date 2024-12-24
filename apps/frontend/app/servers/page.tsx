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

  const handleJoinServer = useCallback(async (server: Server) => {
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
    } catch (error) {
      console.error('Failed to join server:', error);
      toast({
        title: 'エラー',
        description: 'サーバーへの参加に失敗しました',
        variant: 'destructive',
      });
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

  const totalServers = servers.length;
  const joinedServers = servers.filter((server) => server.isJoined).length;

  if (isLoading) {
    return <div>Loading...</div>; // ローディング表示を追加
  }

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      <div className='fixed inset-0 z-0'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
        <div className='absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000' />
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
                onJoinServer={handleJoinServer}
                onCreateCalendar={handleCreateCalendar}
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
