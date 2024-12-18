'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { CalendarIcon, Plus, ServerIcon, X } from 'lucide-react';
import { client } from '../../lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import Header from '../components/Header';
import { Calendar, ServerWithRelations } from '../../apis/@types';
import { Input } from '../components/ui/input';
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../components/ui/toast';
import { logger } from '../../lib/logger';
import { LoadingSpinner } from '../components/ui/loading-spinner';

function ServersContent() {
  const { user, loading } = useAuth();
  const [servers, setServers] = useState<ServerWithRelations[]>([]);
  const [selectedServer, setSelectedServer] =
    useState<ServerWithRelations | null>(null);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>();
  const [isServerMember, setIsServerMember] = useState<Boolean>();
  const [showCreateCalendarForm, setShowCreateCalendarForm] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [showJoinServerDialog, setShowJoinServerDialog] = useState(false);
  const router = useRouter();
  const [toast, setToast] = useState<{
    title: string;
    description: string;
    show: boolean;
    variant: 'default' | 'success' | 'error';
  }>({ title: '', description: '', show: false, variant: 'default' });
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await client.auth.servers.get();
        logger.log('response', response);
        // response.body.servers.dataからデータを取得
        if (response.body.data) {
          setServers(response.body.data);
        }
      } catch (error) {
        logger.error('Failed to fetch servers:', error);
      }
    };

    if (user) {
      fetchServers();
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      setToast({
        title: '認証成功',
        description: 'ログインに成功しました',
        show: true,
        variant: 'success',
      });
      setTimeout(() => {
        setToast({
          title: '',
          description: '',
          show: false,
          variant: 'default',
        });
      }, 3000);
    }
  }, [searchParams]);

  const handleServerSelect = async (server: ServerWithRelations) => {
    setSelectedServer(server);
    try {
      const response = await client.servers.me.server_user.$get({
        query: {
          serverId: server.id,
        },
      });

      console.log('response', response);

      // responseがtrueの場合はメンバー、それ以外は非メンバー
      if (response === true) {
        setShowCalendarDialog(true);
      } else {
        setShowJoinServerDialog(true);
      }
    } catch (error) {
      console.error('Server membership check error:', error);
      setShowJoinServerDialog(true);
    }
  };

  const handleCalendarSelect = async (calendarId: string) => {
    setIsLoading(true);
    try {
      router.push(`/calendar/${calendarId}`);
    } catch (error) {
      setToast({
        title: 'エラー',
        description: 'カレンダーの読み込みに失敗しました',
        show: true,
        variant: 'error',
      });
    }
  };

  const handleCalendarConfirm = () => {
    if (selectedCalendarId) {
      router.push(`/calendar/${selectedCalendarId}`);
    }
  };

  const handleCreateCalendar = async () => {
    try {
      logger.log('handleCreateCalendar');
      if (!showCreateCalendarForm) {
        setShowCreateCalendarForm(true);
        return;
      }

      if (!newCalendarName.trim()) {
        return;
      }

      logger.log('create calendar');
      const response = await client.calendars.$post({
        body: {
          name: newCalendarName,
          serverId: selectedServer?.id || '',
          serverName: selectedServer?.name || '',
          icon: selectedServer?.icon || null,
        },
      });
      logger.log('response', response.id);
      setToast({
        title: 'カレンダー作成完了',
        description: `${newCalendarName}を作成しました`,
        show: true,
        variant: 'success',
      });

      setShowCalendarDialog(false);
      setShowCreateCalendarForm(false);
      setNewCalendarName('');
      router.push(`/calendar/${response.id}`);
    } catch (error) {
      setToast({
        title: 'エラー',
        description: 'カレンダーの作成に失敗しました',
        show: true,
        variant: 'error',
      });
    }
  };

  const handleJoinServer = async () => {
    if (!selectedServer) return;

    try {
      await client.servers.join.$post({
        body: {
          serverId: selectedServer.id,
          serverName: selectedServer.name,
          serverIcon: selectedServer.icon || '',
        },
      });

      setShowJoinServerDialog(false);
      setShowCalendarDialog(true);

      setToast({
        title: 'サーバー参加完了',
        description: `${selectedServer.name}に参加しました`,
        show: true,
        variant: 'success',
      });
    } catch (error) {
      setToast({
        title: 'エラー',
        description: 'サーバーへの参加に失敗しました',
        show: true,
        variant: 'error',
      });
    }
  };

  const handleCloseCalendarDialog = () => {
    setShowCalendarDialog(false);
    setSelectedServer(null);
    setShowCreateCalendarForm(false);
    setNewCalendarName('');
  };

  if (isLoading) {
    return <LoadingSpinner message='カレンダーを読み込んでいます...' />;
  }

  return (
    <>
      <div className='min-h-screen bg-gray-900 text-gray-100'>
        <Header />
        <main className='container mx-auto p-4'>
          <h1 className='text-2xl sm:text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center'>
            <ServerIcon className='mr-2 h-6 w-6 sm:h-8 sm:w-8 text-purple-400' />
            サーバーを選択
          </h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {servers.map((server) => (
              <Card
                key={server.id}
                className='bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer h-[280px] flex flex-col'
                onClick={() => handleServerSelect(server)}
              >
                <CardHeader className='text-center flex-1 flex flex-col items-center justify-center pt-8 pb-4'>
                  <div className='w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center overflow-hidden mb-4'>
                    {server.icon ? (
                      <img
                        src={server.icon}
                        alt={server.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <ServerIcon className='w-12 h-12 text-gray-400' />
                    )}
                  </div>
                  <CardTitle className='text-xl'>{server.name}</CardTitle>
                </CardHeader>
                <CardContent className='text-center pb-8 border-t border-gray-800 pt-4'>
                  <div className='flex items-center justify-center text-sm text-gray-400'>
                    <CalendarIcon className='w-4 h-4 mr-1' />
                    {server.calendars?.length ?? 0}個のカレンダー
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {showCalendarDialog && selectedServer && (
            <Dialog open onOpenChange={handleCloseCalendarDialog}>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle className='text-xl'>
                    カレンダーを選択
                  </DialogTitle>
                  <DialogDescription>
                    既存のカレンダーを選択するか、新しいカレンダーを作成できます
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-6 my-4'>
                  {selectedServer.calendars.length > 0 && (
                    <Select
                      onValueChange={handleCalendarSelect}
                      value={selectedCalendarId}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='カレンダーを選択してください' />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedServer.calendars?.map((calendar: Calendar) => (
                          <SelectItem key={calendar.id} value={calendar.id}>
                            <div className='flex items-center'>
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {calendar.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {showCreateCalendarForm ? (
                    <div className='space-y-4'>
                      <Input
                        placeholder='カレンダー名を入力'
                        value={newCalendarName}
                        onChange={(e) => setNewCalendarName(e.target.value)}
                      />
                    </div>
                  ) : (
                    <Button
                      className='w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
                      onClick={handleCreateCalendar}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      新しいカレンダーを作成
                    </Button>
                  )}
                </div>

                <DialogFooter className='flex flex-col sm:flex-row gap-2'>
                  <Button
                    variant='outline'
                    onClick={handleCloseCalendarDialog}
                    className='w-full sm:w-auto border-gray-700 hover:bg-gray-800'
                  >
                    キャンセル
                  </Button>
                  {showCreateCalendarForm ? (
                    <Button
                      onClick={handleCreateCalendar}
                      disabled={!newCalendarName.trim()}
                      className='w-full sm:w-auto bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      作成
                    </Button>
                  ) : (
                    selectedServer.calendars.length > 0 && (
                      <Button
                        onClick={handleCalendarConfirm}
                        disabled={!selectedCalendarId}
                        className='w-full sm:w-auto bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        選択
                      </Button>
                    )
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {showJoinServerDialog && selectedServer && (
            <Dialog open onOpenChange={() => setShowJoinServerDialog(false)}>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle className='text-xl'>サーバーに参加</DialogTitle>
                  <DialogDescription>
                    このサーバーのカレンダーには参加していません。参加しますか？
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className='flex flex-col sm:flex-row gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => setShowJoinServerDialog(false)}
                    className='w-full sm:w-auto border-gray-700 hover:bg-gray-800'
                  >
                    キャンセル
                  </Button>
                  <Button
                    onClick={handleJoinServer}
                    className='w-full sm:w-auto bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700'
                  >
                    参加
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>

      <ToastProvider>
        {toast.show && (
          <Toast
            variant={toast.variant}
            onOpenChange={(open) => {
              if (!open) setToast({ ...toast, show: false });
            }}
          >
            <div className='grid gap-1'>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </div>
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
    </>
  );
}

export default function ServersPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100' />
        </div>
      }
    >
      <ServersContent />
    </Suspense>
  );
}
