'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { client } from '../../lib/api';
import Header from '../components/Header';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ServerIcon,
  Plus,
  CalendarDays,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { HeartCheckbox } from '../components/ui/heart-checkbox';
import { toast } from '../components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';

interface Server {
  id: string;
  name: string;
  icon: string | null;
  calendars: Array<{
    id: string;
    name: string;
  }>;
  isJoined?: boolean;
  isFavorite?: boolean;
  updatedAt?: string;
}

export default function ServersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [showCreateCalendarDialog, setShowCreateCalendarDialog] =
    useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [newCalendarName, setNewCalendarName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchServers = async () => {
      if (!user) return;
      try {
        console.log('fetchServers');
        const response = await client.auth.servers.get();
        const serversData = response.body.data;

        // サーバー情報を整形
        const serversWithJoinStatus = serversData.map((server) => {
          const serverUser = server.serverUsers[0]; // ユーザーごとのサーバー情報
          return {
            ...server,
            isJoined: server.serverUsers.length > 0,
            isFavorite: serverUser?.isFavorite || false,
            updatedAt: serverUser?.updatedAt || new Date(0).toISOString(),
          };
        });

        // お気に入りと更新日時でソート
        const sortedServers = serversWithJoinStatus.sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) {
            return b.isFavorite ? 1 : -1;
          }
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

        setServers(sortedServers);

        // お気に入り状態を初期化
        const initialFavoriteStates = sortedServers.reduce(
          (acc, server) => ({
            ...acc,
            [server.id]: server.isFavorite,
          }),
          {}
        );
        setFavoriteStates(initialFavoriteStates);
      } catch (error) {
        console.error('Failed to fetch servers:', error);
      }
    };

    fetchServers();
  }, [user]);

  const handleCreateCalendar = async (serverId: string) => {
    setSelectedServerId(serverId);
    setShowCreateCalendarDialog(true);
  };

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

      setFavoriteStates((prev) => ({
        ...prev,
        [serverId]: isFavorite,
      }));

      toast({
        title: isFavorite ? 'お気に入りに追加' : 'お気に入りから削除',
        description: (
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center ring-1 ring-pink-500/30'>
              <HeartCheckbox
                className='w-4 h-4 text-pink-400'
                checked={isFavorite}
                readOnly
              />
            </div>
            <span>
              {isFavorite
                ? 'お気に入りに追加しました'
                : 'お気に入りから削除しました'}
            </span>
          </div>
        ),
        className:
          'bg-gray-900/95 border border-gray-800/60 backdrop-blur-md fixed top-4 left-1/2 transform -translate-x-1/2',
      });
    } catch (error) {
      console.error('Failed to update favorite:', error);
      toast({
        title: 'エラー',
        description: 'お気に入りの更新に失敗しました',
        variant: 'destructive',
        className:
          'bg-gray-900/95 border border-gray-800/60 backdrop-blur-md fixed top-4 left-1/2 transform -translate-x-1/2',
      });
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

      setServers((prevServers) =>
        prevServers.map((s) =>
          s.id === server.id ? { ...s, isJoined: true } : s
        )
      );

      toast({
        title: '参加完了',
        description: (
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center ring-1 ring-emerald-500/30'>
              <Users className='w-4 h-4 text-emerald-400' />
            </div>
            <span>{server.name} に参加しました</span>
          </div>
        ),
        className:
          'bg-gray-900/95 border border-gray-800/60 backdrop-blur-md fixed top-4 left-1/2 transform -translate-x-1/2',
      });

      setShowJoinDialog(false);
    } catch (error) {
      console.error('Failed to join server:', error);
      toast({
        title: 'エラー',
        description: 'サーバーへの参加に失敗しました',
        variant: 'destructive',
        className:
          'bg-gray-900/95 border border-gray-800/60 backdrop-blur-md fixed top-4 left-1/2 transform -translate-x-1/2',
      });
    }
  };

  const renderServerActions = (server: Server) => {
    if (!server.isJoined) {
      return (
        <Button
          className='w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
          onClick={() => handleJoinServer(server)}
        >
          <Users className='w-4 h-4 mr-2' />
          サーバーに参加
        </Button>
      );
    }

    return (
      <div className='space-y-3'>
        <div className='flex items-center justify-between px-1'>
          <div className='flex items-center gap-2'>
            <CalendarDays className='w-4 h-4 text-purple-400' />
            <span className='text-sm font-medium text-gray-300'>
              作成済みカレンダー
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 hover:bg-gray-700/50 hover:text-purple-400 transition-colors'
                  onClick={() => handleCreateCalendar(server.id)}
                >
                  <Plus className='w-4 h-4' />
                  <span className='sr-only'>新規作成</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='bg-gray-800 border-gray-700'
              >
                <p>新規作成</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className='space-y-1.5'>
          {server.calendars.length > 0 ? (
            server.calendars.map((calendar) => (
              <Button
                key={calendar.id}
                variant='outline'
                className='w-full justify-start border-gray-700 hover:bg-gray-700/50 group relative overflow-hidden'
                onClick={() => router.push(`/calendar/${calendar.id}`)}
              >
                <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity' />
                <div className='relative flex items-center w-full'>
                  <div className='flex items-center gap-2 min-w-0'>
                    <div className='p-1 rounded-md bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors'>
                      <CalendarDays className='w-4 h-4' />
                    </div>
                    <span className='truncate text-gray-300 group-hover:text-gray-100 transition-colors'>
                      {calendar.name}
                    </span>
                  </div>
                  <div className='ml-auto pl-3'>
                    <div className='p-1 rounded-full hover:bg-gray-700/50 text-gray-400 opacity-0 group-hover:opacity-100 transition-all'>
                      <ArrowRight className='w-3 h-3' />
                    </div>
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className='text-sm text-gray-500 text-center py-2'>
              カレンダーがありません
            </div>
          )}
        </div>
      </div>
    );
  };

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
      await client.calendars.$post({
        body: {
          name: newCalendarName,
          serverId: selectedServerId,
          serverName: selectedServer?.name || '',
          icon: selectedServer?.icon || null,
        },
      });
      setShowCreateCalendarDialog(false);
      toast({
        title: '作成完了',
        description: 'カレンダーを作成しました',
      });
      window.location.reload();
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

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      <div className='fixed inset-0 z-0'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
        <div className='absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000' />
      </div>

      <Header />

      <main className='flex-1 container mx-auto px-4 pt-24'>
        <motion.div
          className='space-y-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className='space-y-4'>
            <h1 className='text-3xl font-bold text-gray-100'>サーバーを選択</h1>
            <div className='flex items-center gap-2 text-sm text-gray-400'>
              <Users className='w-4 h-4' />
              <span>接続中のサーバー: {totalServers}</span>
              <span className='mx-2'>•</span>
              <span>参加済み: {joinedServers}</span>
            </div>
            <p className='text-gray-400'>
              カレンダーを管理したいDiscordサーバーを選択してください
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {servers.map((server) => (
              <motion.div
                key={server.id}
                className='group relative'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300' />
                <div className='relative p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-800/70 transition-colors'>
                  <div className='flex items-start gap-4'>
                    {server.icon ? (
                      <div className='relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-gray-700/50'>
                        <Image
                          src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                          alt={server.name}
                          fill
                          sizes='20vw'
                          className='object-cover'
                        />
                      </div>
                    ) : (
                      <div className='w-12 h-12 rounded-xl bg-gray-700/50 flex items-center justify-center'>
                        <ServerIcon className='w-6 h-6 text-gray-400' />
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-2'>
                        <div className='flex-1 min-w-0'>
                          <h3 className='text-lg font-semibold text-gray-100 truncate'>
                            {server.name}
                          </h3>
                          {server.isJoined && (
                            <div className='mt-1.5 inline-flex items-center'>
                              <div className='px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-emerald-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:border-emerald-500/40 transition-all'>
                                <div className='flex items-center gap-1.5'>
                                  <div className='w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse' />
                                  <span className='text-xs font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
                                    参加済み
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <HeartCheckbox
                          className='text-gray-400 hover:text-pink-400 shrink-0'
                          checked={favoriteStates[server.id] || false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleFavoriteChange(server.id, e.target.checked)
                          }
                        />
                      </div>
                      <div className='flex items-center gap-3 mt-1.5'>
                        <div className='flex items-center gap-1 text-sm text-gray-400'>
                          <CalendarDays className='w-4 h-4' />
                          <span>{server.calendars.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 space-y-2'>
                    {!server.isJoined ? (
                      <Button
                        className='w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
                        onClick={() => handleJoinServer(server)}
                      >
                        <Users className='w-4 h-4 mr-2' />
                        サーバーに参加
                      </Button>
                    ) : (
                      renderServerActions(server)
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {showCreateCalendarDialog && (
        <Dialog open onOpenChange={() => setShowCreateCalendarDialog(false)}>
          <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-gray-100'>
                カレンダーの作成
              </DialogTitle>
              <DialogDescription className='text-gray-400'>
                新しいカレンダーを作成します。
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-6 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='calendar-name' className='text-gray-200'>
                  カレンダー名
                </Label>
                <Input
                  id='calendar-name'
                  placeholder='例: レイドイベント'
                  value={newCalendarName}
                  onChange={(e) => setNewCalendarName(e.target.value)}
                  className='bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500'
                />
              </div>
            </div>
            <DialogFooter className='gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowCreateCalendarDialog(false)}
                className='border-gray-700 hover:bg-gray-800/60'
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleCreateCalendarSubmit}
                className='bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg shadow-purple-500/20'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    作成中...
                  </div>
                ) : (
                  '作成する'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showJoinDialog && selectedServer && (
        <Dialog open onOpenChange={() => setShowJoinDialog(false)}>
          <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-gray-100'>
                サーバーへの参加
              </DialogTitle>
              <DialogDescription className='text-gray-400'>
                以下のサーバーに参加してカレンダーを利用しましょう
              </DialogDescription>
            </DialogHeader>

            <div className='p-4 mt-2 rounded-xl bg-gray-800/50 border border-gray-700/50'>
              <div className='flex items-center gap-4'>
                {selectedServer.icon ? (
                  <div className='relative w-16 h-16 rounded-xl overflow-hidden ring-1 ring-gray-700/50'>
                    <Image
                      src={`https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png`}
                      alt={selectedServer.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='w-16 h-16 rounded-xl bg-gray-700/50 flex items-center justify-center'>
                    <ServerIcon className='w-8 h-8 text-gray-400' />
                  </div>
                )}
                <div className='flex-1 min-w-0'>
                  <h3 className='text-lg font-semibold text-gray-100 truncate'>
                    {selectedServer.name}
                  </h3>
                  <div className='flex items-center gap-3 mt-1'>
                    <div className='flex items-center gap-1.5 text-sm text-gray-400'>
                      <CalendarDays className='w-4 h-4' />
                      <span>{selectedServer.calendars.length} カレンダー</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20'>
              <p className='text-sm text-indigo-300 flex items-start gap-2'>
                <Users className='w-4 h-4 mt-0.5 shrink-0' />
                <span>
                  サーバーに参加すると、メンバーとカレンダーを共有できるようになります。
                </span>
              </p>
            </div>

            <DialogFooter className='gap-2 mt-6'>
              <Button
                variant='outline'
                onClick={() => setShowJoinDialog(false)}
                className='border-gray-700 hover:bg-gray-800/60'
              >
                キャンセル
              </Button>
              <Button
                onClick={() => handleJoinServer(selectedServer)}
                className='bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20 min-w-[100px]'
              >
                <Users className='w-4 h-4 mr-2' />
                参加する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
