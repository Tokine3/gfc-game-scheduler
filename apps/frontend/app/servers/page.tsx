'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { client } from '../../lib/api';
import { ServerWithRelations } from '../../apis/@types';
import Header from '../components/Header';
import Image from 'next/image';
import {
  CalendarDays,
  Plus,
  ServerCrash,
  UserPlus,
  Calendar as CalendarIcon,
  Check,
  X,
  CalendarFoldIcon,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';
import { Toaster } from '../components/ui/toaster';
import { HeartCheckbox } from '../components/ui/heart-checkbox';

type GetUserServersResponse = {
  data: ServerWithRelations[];
  calendarCount: number;
};

export default function ServersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [servers, setServers] = useState<GetUserServersResponse | null>(null);
  const [loadingServers, setLoadingServers] = useState(true);
  const { toast } = useToast();
  const [selectedServer, setSelectedServer] =
    useState<ServerWithRelations | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateCalendarModal, setShowCreateCalendarModal] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [favoriteServers, setFavoriteServers] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchServers = async () => {
      if (!user) return;
      try {
        const response = await client.auth.servers.get();
        setServers(response.body);
      } catch (error) {
        console.error('Failed to fetch servers:', error);
      } finally {
        setLoadingServers(false);
      }
    };

    fetchServers();
  }, [user]);

  const handleJoinServer = async (server: ServerWithRelations) => {
    try {
      await client.servers.join.$post({
        body: {
          serverId: server.id,
          serverName: server.name,
          serverIcon: server.icon || '',
        },
      });
      const response = await client.auth.servers.get();
      setServers(response.body);
      setShowJoinModal(false);

      toast({
        title: 'サーバーに参加しました',
        description: `${server.name}に参加しました`,
        duration: 3000,
        className:
          'top-4 right-4 md:top-4 md:right-auto md:left-1/2 md:-translate-x-1/2',
      });
    } catch (error) {
      console.error('Failed to join server:', error);
    }
  };

  const handleCreateCalendar = async (serverId: string) => {
    if (!newCalendarName.trim()) return;

    try {
      const response = await client.calendars.$post({
        body: {
          serverId,
          name: newCalendarName,
          serverName: selectedServer?.name || '',
          icon: selectedServer?.icon || '',
        },
      });
      setShowCreateCalendarModal(false);
      setNewCalendarName('');
      router.push(`/calendar/${response.id}`);
    } catch (error) {
      console.error('Failed to create calendar:', error);
    }
  };

  const handleFavoriteChange = (serverId: string, checked: boolean) => {
    setFavoriteServers((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(serverId);
      } else {
        next.delete(serverId);
      }
      return next;
    });
  };

  if (loading || loadingServers) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      <Toaster />
      <Header />
      <main className='container mx-auto px-4 py-8 flex-grow'>
        {/* サマリーセクション */}
        <div className='mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div className='bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors duration-200'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-purple-500/10 rounded-lg'>
                <ServerCrash className='w-6 h-6 text-purple-400' />
              </div>
              <div>
                <p className='text-sm text-gray-400'>接続済みサーバー</p>
                <p className='text-2xl font-bold text-gray-100'>
                  {servers?.data.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className='bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors duration-200'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-pink-500/10 rounded-lg'>
                <CalendarDays className='w-6 h-6 text-pink-400' />
              </div>
              <div>
                <p className='text-sm text-gray-400'>作成済みカレンダー</p>
                <p className='text-2xl font-bold text-gray-100'>
                  {servers?.calendarCount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* サーバーリスト */}
        <h2 className='text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2'>
          <ServerCrash className='w-5 h-5' />
          接続済みサーバー
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
          {servers?.data.map((server) => {
            const isServerMember = server.serverUsers.length > 0;
            const hasCalendars = server.calendars.length > 0;

            return (
              <div
                key={server.id}
                className='group bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden transition-all duration-200 hover:border-gray-600/50 hover:bg-gray-800/70'
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-4'>
                      {server.icon ? (
                        <Image
                          src={server.icon}
                          alt={server.name}
                          width={48}
                          height={48}
                          className='rounded-full'
                        />
                      ) : (
                        <div className='w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center'>
                          <span className='text-lg font-bold text-gray-300'>
                            {server.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className='font-semibold text-gray-100'>
                          {server.name}
                        </h3>
                        <p className='text-sm text-gray-400'>
                          {server.calendars.length} カレンダー
                        </p>
                      </div>
                    </div>
                    <HeartCheckbox
                      checked={favoriteServers.has(server.id)}
                      onCheckedChange={(checked) =>
                        handleFavoriteChange(server.id, checked)
                      }
                      className='hover:scale-110 active:scale-95'
                    />
                  </div>

                  <div className='space-y-2'>
                    {hasCalendars && (
                      <div className='space-y-2 mb-4'>
                        <div className='flex items-center gap-2 text-sm text-gray-400 mb-2'>
                          <CalendarIcon className='w-4 h-4' />
                          カレンダー一覧
                        </div>
                        {server.calendars.map((calendar) => (
                          <button
                            key={calendar.id}
                            onClick={() =>
                              router.push(`/calendar/${calendar.id}`)
                            }
                            className='w-full text-left p-4 rounded-md bg-gray-700/50 hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3'
                          >
                            <CalendarFoldIcon className='w-5 h-5 text-gray-400' />
                            <div>
                              <p className='font-medium text-gray-200'>
                                {calendar.name}
                              </p>
                              {/* <p className='text-sm text-gray-400'>
                                作成日:{' '}
                                {new Date(
                                  calendar.createdAt
                                ).toLocaleDateString()}
                              </p> */}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!isServerMember ? (
                      <Button
                        variant='outline'
                        className='w-full border border-purple-500/30 text-purple-200 hover:bg-purple-500/10'
                        onClick={() => {
                          setSelectedServer(server);
                          setShowJoinModal(true);
                        }}
                      >
                        <UserPlus className='w-4 h-4 mr-2' />
                        サーバーに参加する
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        className='w-full border-dashed border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
                        onClick={() => {
                          setSelectedServer(server);
                          setShowCreateCalendarModal(true);
                        }}
                      >
                        <Plus className='w-4 h-4 mr-2' />
                        新しいカレンダーを作成
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {servers?.data.length === 0 && (
          <div className='text-center py-12'>
            <ServerCrash className='w-12 h-12 text-gray-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-300 mb-2'>
              接続済みサーバーがありません
            </h3>
            <p className='text-gray-400'>
              Discordサーバーに参加しているサーバーが表示されます
            </p>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className='border-t border-gray-800 py-4 mt-auto'>
        <div className='container mx-auto px-4'>
          <p className='text-center text-sm text-gray-500'>
            © 2024 GFC Scheduler. All rights reserved.
          </p>
        </div>
      </footer>

      {/* サーバー参加確認モーダル */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent className='sm:max-w-[425px] bg-gray-800 text-gray-100 border-gray-700'>
          <DialogHeader>
            <DialogTitle>サーバーへの参加確認</DialogTitle>
            <DialogDescription className='text-gray-400'>
              {selectedServer?.name}に参加します。よろしいですか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              className='border-gray-600'
              onClick={() => setShowJoinModal(false)}
            >
              <X className='w-4 h-4 mr-2' />
              キャンセル
            </Button>
            <Button
              type='submit'
              className='bg-purple-500 hover:bg-purple-600'
              onClick={() => selectedServer && handleJoinServer(selectedServer)}
            >
              <Check className='w-4 h-4 mr-2' />
              参加する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* カレンダー作成モーダル */}
      <Dialog
        open={showCreateCalendarModal}
        onOpenChange={setShowCreateCalendarModal}
      >
        <DialogContent className='sm:max-w-[425px] bg-gray-800 text-gray-100 border-gray-700'>
          <DialogHeader>
            <DialogTitle>新しいカレンダーを作成</DialogTitle>
            <DialogDescription className='text-gray-400'>
              カレンダーの名前を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Input
              value={newCalendarName}
              onChange={(e) => setNewCalendarName(e.target.value)}
              placeholder='カレンダー名'
              className='bg-gray-700 border-gray-600 text-gray-100'
            />
          </div>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              className='border-gray-600'
              onClick={() => {
                setShowCreateCalendarModal(false);
                setNewCalendarName('');
              }}
            >
              <X className='w-4 h-4 mr-2' />
              キャンセル
            </Button>
            <Button
              type='submit'
              className='bg-purple-500 hover:bg-purple-600'
              onClick={() =>
                selectedServer && handleCreateCalendar(selectedServer.id)
              }
              disabled={!newCalendarName.trim()}
            >
              <Check className='w-4 h-4 mr-2' />
              作成する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
