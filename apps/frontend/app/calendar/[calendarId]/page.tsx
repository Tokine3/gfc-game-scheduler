'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from '../../components/Calendar';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { client } from '../../../lib/api';
import { CalendarWithRelations } from '../../../api/@types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';

interface CalendarPageProps {
  params: Promise<{ calendarId: string }>;
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [calendar, setCalendar] = useState<CalendarWithRelations>();
  const { calendarId } = use(params);

  const fetchCalendar = useCallback(async () => {
    if (!user) return;

    try {
      const calendarResponse = await client.calendars._id(calendarId).get();
      const serverResponse = await client.auth.servers.get();
      const userServers = serverResponse.body.data;

      // サーバーへのアクセス権限チェック
      const hasServerAccess = userServers.some(
        (s) => s.id === calendarResponse.body.serverId
      );

      if (!hasServerAccess) {
        setError('このカレンダーにアクセスする権限がありません');
        setTimeout(() => router.push('/servers'), 3000);
        return;
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
      }

      setCalendar(calendarResponse.body);
    } catch (error) {
      console.error('Failed to fetch calendar:', error);
      setError('カレンダーの取得に失敗しました');
      router.push('/servers');
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

  // エラー表示
  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-2 rounded-md'>
          {error}
        </div>
      </div>
    );
  }

  // サーバー参加確認ダイアログ
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
                  console.error('Failed to join server:', error);
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

  if (loading || error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100' />
      </div>
    );
  }

  return (
    <div className='min-h-screen text-gray-100'>
      <Header />
      <main className='container mx-auto p-4'>
        {calendar && <Calendar {...calendar} />}
      </main>
    </div>
  );
}
