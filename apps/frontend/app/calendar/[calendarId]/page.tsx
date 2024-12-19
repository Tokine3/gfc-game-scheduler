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
    <div className='flex flex-col min-h-screen bg-gray-900'>
      <Header />

      {/* メインコンテンツ */}
      <div className='flex-1 flex flex-col mt-16'>
        {' '}
        {/* Header の高さ分だけ margin-top を設定 */}
        {/* カレンダーヘッダー */}
        <div className='sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/60'>
          <div className='container mx-auto px-4 py-3'>
            <div className='flex flex-col gap-3'>
              {/* 上部: 戻るボタンとカレンダー情報 */}
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => router.push('/servers')}
                  className='p-1.5 rounded-full hover:bg-gray-800/60 transition-colors shrink-0'
                >
                  <ChevronLeft className='w-5 h-5 text-gray-400' />
                </button>
                <div className='min-w-0'>
                  <h1 className='text-lg sm:text-xl font-bold text-gray-100 flex items-center gap-2 truncate'>
                    <CalendarIcon className='w-5 h-5 text-purple-400 shrink-0' />
                    <span className='truncate'>{calendar?.name}</span>
                  </h1>
                  <p className='text-xs text-gray-400 flex items-center gap-1.5 truncate'>
                    <Users className='w-3.5 h-3.5 shrink-0' />
                    <span className='truncate'>{calendar?.server.name}</span>
                  </p>
                </div>
              </div>

              {/* 下部: アクションボタン */}
              <div className='flex items-center gap-2 overflow-x-auto scrollbar-none'>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-gray-700 hover:bg-gray-800 whitespace-nowrap text-sm'
                >
                  <Bell className='w-3.5 h-3.5 sm:mr-2' />
                  <span className='ml-1.5 sm:ml-0'>通知</span>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-gray-700 hover:bg-gray-800 whitespace-nowrap text-sm'
                >
                  <Settings className='w-3.5 h-3.5 sm:mr-2' />
                  <span className='ml-1.5 sm:ml-0'>設定</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* カレンダーコンテンツ */}
        <div className='flex-1'>
          <main className='container mx-auto p-4'>
            {calendar && <Calendar {...calendar} />}
          </main>
        </div>
      </div>
    </div>
  );
}
