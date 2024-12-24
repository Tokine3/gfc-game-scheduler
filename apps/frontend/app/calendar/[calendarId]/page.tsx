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
import Image from 'next/image';
import { LoadingScreen } from '../../components/LoadingScreen';

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

  // // ローディング表示の改善
  // if (loading || !calendar) {
  //   return (
  //     <LoadingScreen
  //       message={
  //         <>
  //           <span className='text-purple-400 font-semibold'>
  //             {calendar?.name}
  //           </span>
  //           <span>に移動中...</span>
  //         </>
  //       }
  //     />
  //   );
  // }

  // サーバー参加確認ダイアログの改善
  if (showJoinDialog && calendar) {
    return (
      <Dialog open onOpenChange={() => setShowJoinDialog(false)}>
        <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800'>
          <DialogHeader>
            <div className='mx-auto bg-gradient-to-br from-violet-500/20 to-indigo-500/20 p-3 rounded-xl border border-violet-500/20'>
              <ServerIcon className='h-6 w-6 text-violet-400' />
            </div>
            <DialogTitle className='text-xl font-bold text-center text-gray-100'>
              サーバーへの参加
            </DialogTitle>
            <DialogDescription className='text-center text-gray-400'>
              このカレンダーを利用するにはサーバーに参加する必要があります
            </DialogDescription>
          </DialogHeader>

          <div className='p-4 mt-2 rounded-xl bg-gray-800/50 border border-gray-700/50'>
            <div className='flex items-center gap-4'>
              {calendar.server.icon ? (
                <div className='relative w-16 h-16 rounded-xl overflow-hidden ring-1 ring-gray-700/50'>
                  <Image
                    src={`https://cdn.discordapp.com/icons/${calendar.server.id}/${calendar.server.icon}.png`}
                    alt={calendar.server.name}
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='w-16 h-16 rounded-xl bg-gray-700/50 flex items-center justify-center'>
                  <ServerIcon className='w-8 h-8 text-gray-400' />
                </div>
              )}
              <div>
                <h3 className='text-lg font-semibold text-gray-100'>
                  {calendar.server.name}
                </h3>
                <p className='text-sm text-gray-400 mt-1'>
                  サーバーに参加してカレンダーを利用しましょう
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className='gap-2 mt-6'>
            <Button
              variant='outline'
              onClick={() => router.push('/servers')}
              className='flex-1 border-gray-700 hover:bg-gray-800/60'
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
              className='flex-1 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
            >
              <Users className='w-4 h-4 mr-2' />
              参加する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      {/* 装飾的な背景要素の改善 */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
        <div className='absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000' />
      </div>

      <Header />

      {/* メインコンテンツ */}
      <div className='flex-1 flex flex-col mt-16'>
        {/* カレンダーヘッダーの改善 */}
        <div className='sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/60'>
          <motion.div
            className='container mx-auto px-4 py-4'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex flex-col gap-4'>
              {/* 上部: 戻るボタンとカレンダー情報 */}
              <div className='flex items-center gap-4'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => router.push('/servers')}
                  className='rounded-full hover:bg-gray-800/60 group'
                >
                  <ChevronLeft className='w-5 h-5 text-gray-400 group-hover:text-violet-400 transition-colors' />
                </Button>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2.5 min-w-0'>
                      <div className='p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20'>
                        <CalendarIcon className='w-5 h-5 text-violet-400' />
                      </div>
                      <h1 className='text-lg sm:text-xl font-bold text-gray-100 truncate'>
                        {calendar?.name}
                      </h1>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-9 px-4 border-gray-700 hover:bg-gray-800/60 hover:border-violet-500/50 whitespace-nowrap group transition-all bg-gray-800/50'
                    >
                      <div className='p-1 rounded-md bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors'>
                        <Settings className='w-4 h-4' />
                      </div>
                      <span className='ml-2 text-gray-300 group-hover:text-gray-100 transition-colors'>
                        設定
                      </span>
                    </Button>
                  </div>
                  <div className='mt-1 flex items-center gap-3 text-sm text-gray-400'>
                    <div className='flex items-center gap-1.5'>
                      <div className='p-1 rounded-lg bg-gray-800/60'>
                        <ServerIcon className='w-3.5 h-3.5' />
                      </div>
                      <span className='truncate'>{calendar?.server.name}</span>
                    </div>
                    <div className='w-1 h-1 rounded-full bg-gray-700' />
                    <div className='flex items-center gap-1.5'>
                      <Users className='w-3.5 h-3.5' />
                      <span>12人</span>
                    </div>
                  </div>
                </div>
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
    </div>
  );
}
