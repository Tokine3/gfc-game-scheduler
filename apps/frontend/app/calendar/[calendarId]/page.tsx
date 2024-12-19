'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from '../../components/Calendar';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { client } from '../../../lib/api';
import { CalendarWithRelations } from '../../../apis/@types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { logger } from '../../../lib/logger';
import {
  ArrowLeft,
  ServerIcon,
  CalendarDays,
  Settings,
  Users,
  Bell,
  Calendar as CalendarIcon,
  ChevronLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarPageProps {
  params: Promise<{ calendarId: string }>;
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [calendar, setCalendar] = useState<CalendarWithRelations>();
  const { calendarId } = use(params);

  const fetchCalendar = useCallback(async () => {
    if (!user) return;
    try {
      // カレンダー情報を取得
      const calendarResponse = await client.calendars._id(calendarId).get();

      // ユーザーのサーバー一覧を取得
      const serverResponse = await client.auth.servers.get();
      const userServers = serverResponse.body.data;

      // サーバーへのアクセス権限チェック
      const hasServerAccess = userServers.some(
        (s) => s.id === calendarResponse.body.serverId
      );

      if (!hasServerAccess) {
        // 権限がない場合は即座にリダイレクト
        router.replace('/error/unauthorized');
        throw new Error('unauthorized');
      }

      // サーバーユーザー情報を取得
      const response = await client.servers.me.server_user.$get({
        query: {
          serverId: calendarResponse.body.serverId,
        },
      });

      const isServerMember = response;
      if (!isServerMember) {
        setShowJoinDialog(true);
        return;
      }

      setCalendar(calendarResponse.body);
    } catch (error) {
      if (error instanceof Error && error.message === 'unauthorized') {
        return; // 既にリダイレクト済みの場合は何もしない
      }
      // その他のエラーの場合も権限エラーとして扱う
      router.replace('/error/unauthorized');
    }
  }, [user, calendarId, router]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const fullPath = `/calendar/${calendarId}`;
        sessionStorage.setItem('redirectPath', fullPath);
        router.push('/login');
        return;
      }
      fetchCalendar();
    }
  }, [loading, user, router, calendarId, fetchCalendar]);

  // ローディング表示
  if (loading || !calendar) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100' />
      </div>
    );
  }

  // エーバー参加確認ダイアログ
  if (showJoinDialog && calendar) {
    return (
      <Dialog open onOpenChange={() => setShowJoinDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>サーバーへの参加</DialogTitle>
            <DialogDescription>
              このカレンダーを利用するにはサーバーに参加する必要があります。参加しますか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => router.push('/servers')}>
              キャンセル
            </Button>
            <Button
              onClick={async () => {
                try {
                  await client.servers.join.$post({
                    body: {
                      serverId: calendar.serverId,
                      serverName: calendar.server.name,
                      serverIcon: calendar.server.icon || '',
                    },
                  });
                  setShowJoinDialog(false);
                  window.location.reload();
                } catch (error) {
                  logger.error('Failed to join server:', error);
                }
              }}
            >
              参加する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      {/* 装飾的な背景要素 */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
        <div className='absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000' />
      </div>

      <Header />

      {/* メインコンテンツ */}
      <div className='flex-1 flex flex-col mt-16'>
        {/* カレンダーヘッダー */}
        <div className='sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/60'>
          <motion.div
            className='container mx-auto px-4 py-3'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex flex-col gap-3'>
              {/* 上部: 戻るボタンとカレンダー情報 */}
              <div className='flex items-center gap-3'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => router.push('/servers')}
                  className='rounded-full hover:bg-gray-800/60'
                >
                  <ChevronLeft className='w-5 h-5 text-gray-400' />
                </Button>
                <div className='min-w-0'>
                  <h1 className='text-lg sm:text-xl font-bold text-gray-100 flex items-center gap-2 truncate'>
                    <div className='p-1.5 rounded-lg bg-purple-500/10'>
                      <CalendarIcon className='w-5 h-5 text-purple-400' />
                    </div>
                    <span className='truncate'>{calendar?.name}</span>
                  </h1>
                  <div className='text-sm text-gray-400 flex items-center gap-1.5 truncate'>
                    <div className='p-1 rounded-lg bg-gray-800/60'>
                      <Users className='w-3.5 h-3.5' />
                    </div>
                    <span className='truncate'>{calendar?.server.name}</span>
                  </div>
                </div>
              </div>

              {/* 下部: アクションボタン */}
              <div className='flex items-center gap-2 overflow-x-auto scrollbar-none'>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-9 border-gray-700 hover:bg-gray-800/60 whitespace-nowrap group transition-all'
                >
                  <Bell className='w-4 h-4 mr-2 group-hover:text-cyan-400 transition-colors' />
                  通知設定
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-9 border-gray-700 hover:bg-gray-800/60 whitespace-nowrap group transition-all'
                >
                  <Settings className='w-4 h-4 mr-2 group-hover:text-cyan-400 transition-colors' />
                  カレンダー設定
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* カレンダーコンテンツ */}
        <motion.div
          className='flex-1 container mx-auto p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {calendar && <Calendar {...calendar} />}
        </motion.div>
      </div>

      {/* モーダル類 */}
      {showJoinDialog && calendar && (
        <Dialog open onOpenChange={() => setShowJoinDialog(false)}>
          <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-gray-100'>
                サーバーへの参加
              </DialogTitle>
              <DialogDescription className='text-gray-400'>
                このカレンダーを利用するにはサーバーに参加する必要があります。参加しますか？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='gap-2'>
              <Button
                variant='outline'
                onClick={() => router.push('/servers')}
                className='border-gray-700 hover:bg-gray-800/60'
              >
                キャンセル
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await client.servers.join.$post({
                      body: {
                        serverId: calendar.serverId,
                        serverName: calendar.server.name,
                        serverIcon: calendar.server.icon || '',
                      },
                    });
                    setShowJoinDialog(false);
                    window.location.reload();
                  } catch (error) {
                    logger.error('Failed to join server:', error);
                  }
                }}
                className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/20'
              >
                参加する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
