'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useCalendar } from '../../../hooks/useCalendar';
import { useServerMembership } from '../../../hooks/useServerMembership';
import { Calendar } from './_components';
import Header from '../../components/Header';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { JoinServerPrompt } from '../../servers/_components/JoinServerPrompt/JoinServerPrompt';
import { CalendarWithRelations } from '../../../apis/@types';

interface Props {
  params: Promise<{ calendarId: string }>;
}

export default function CalendarPage({ params }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { calendarId } = use(params);
  const {
    calendar,
    isLoading: calendarLoading,
    isError,
  } = useCalendar(!authLoading && user ? calendarId : undefined);
  const { isMember, isLoading: membershipLoading } = useServerMembership(
    calendar?.serverId
  );

  // 認証チェック
  if (!authLoading && !user) {
    sessionStorage.setItem('redirectPath', `/calendars/${calendarId}`);
    router.replace('/login');
    return null;
  }

  // ローディング表示
  if (authLoading || calendarLoading || membershipLoading) {
    return <LoadingScreen message='カレンダーを読み込んでいます...' />;
  }

  // エラー時は権限エラーページへ
  if (isError) {
    router.replace('/error/unauthorized');
    return null;
  }

  // サーバー未参加の場合
  if (calendar && !isMember) {
    return (
      <div className='min-h-screen bg-gray-900 flex flex-col'>
        <Header />
        <JoinServerPrompt calendar={calendar} />
      </div>
    );
  }

  // メインのカレンダー表示
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
