'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { client } from '../../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { logger } from '../../../lib/logger';
import { CalendarWithRelations } from '../../../apis/@types';
import { Calendar } from './_components';
import Header from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { JoinServerDialog } from '../../servers/_components/JoinServerDialog/JoinServerDialog';
import { LoadingScreen } from '../../components/LoadingScreen';

interface Props {
  params: Promise<{ calendarId: string }>;
}

export default function CalendarPage({ params }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendar, setCalendar] = useState<CalendarWithRelations>();
  const { calendarId } = use(params);

  // 認証状態の即時チェック
  useEffect(() => {
    if (!loading && !user) {
      const redirectPath = `/calendars/${calendarId}`;
      sessionStorage.setItem('redirectPath', redirectPath);
      router.replace('/login');
    }
  }, [loading, user, calendarId, router]);

  // カレンダーデータの取得と権限チェック
  useEffect(() => {
    if (!user || loading) return;

    let mounted = true;

    const checkAccessAndFetchData = async () => {
      try {
        const [calendarData, serverData] = await Promise.all([
          client.calendars._id(calendarId).$get(),
          client.auth.servers.$get(),
        ]);

        if (!mounted) return;

        const hasServerAccess = serverData.data.some(
          (s) => s.id === calendarData.serverId
        );

        if (!hasServerAccess) {
          router.replace('/error/unauthorized');
          return;
        }

        const serverUser = await client.servers.me.server_user.$get({
          query: { serverId: calendarData.serverId },
        });

        if (!mounted) return;

        setCalendar(calendarData);

        if (!serverUser) {
          setShowJoinDialog(true);
        }
      } catch (error) {
        if (!mounted) return;
        logger.error('Failed to fetch calendar:', error);
        router.replace('/error/unauthorized');
      }
    };

    checkAccessAndFetchData();

    return () => {
      mounted = false;
    };
  }, [user, loading, calendarId, router]);

  // ローディング中の表示
  if (loading) {
    return <LoadingScreen message='カレンダーを読み込んでいます...' />;
  }

  // 認証前はなにも表示しない（リダイレクト処理中）
  if (!user) return null;

  if (showJoinDialog && calendar) {
    return (
      <div className='min-h-screen bg-gray-900 flex flex-col'>
        <Header />
        <JoinServerDialog
          server={calendar.server}
          isOpen={true}
          onClose={() => setShowJoinDialog(false)}
          onConfirm={async (server) => {
            setIsSubmitting(true);
            try {
              await client.servers.join.$post({
                body: {
                  serverId: server.id,
                  serverName: server.name,
                  serverIcon: server.icon || '',
                },
              });
              window.location.reload();
            } catch (error) {
              logger.error('Failed to join server:', error);
            } finally {
              setIsSubmitting(false);
            }
          }}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      <BackgroundDecoration />
      <Header />

      <div className='flex-1 flex flex-col mt-16'>
        <CalendarHeader
          calendar={calendar}
          onBack={() => router.push('/servers')}
        />

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

// 背景装飾コンポーネント
function BackgroundDecoration() {
  return (
    <div className='fixed inset-0 z-0'>
      <div className='absolute top-0 -left-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
      <div className='absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
      <div className='absolute -bottom-8 left-20 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000' />
    </div>
  );
}

// カレンダーヘッダーコンポーネント
function CalendarHeader({
  calendar,
  onBack,
}: {
  calendar?: CalendarWithRelations;
  onBack: () => void;
}) {
  return (
    <div className='sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/60'>
      <motion.div
        className='container mx-auto px-4 py-4'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onBack}
            className='rounded-full hover:bg-gray-800/60 group'
          >
            <ChevronLeft className='w-5 h-5 text-gray-400 group-hover:text-violet-400 transition-colors' />
          </Button>

          <div className='min-w-0 flex-1'>
            <CalendarInfo calendar={calendar} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// サレンダー情報コンポーネント
function CalendarInfo({ calendar }: { calendar?: CalendarWithRelations }) {
  if (!calendar) return null;

  return (
    <div className='space-y-1'>
      <h1 className='text-lg font-semibold text-gray-100 truncate'>
        {calendar.name}
      </h1>
      <p className='text-sm text-gray-400 flex items-center gap-2'>
        <CalendarIcon className='w-4 h-4' />
        カレンダー
      </p>
    </div>
  );
}
