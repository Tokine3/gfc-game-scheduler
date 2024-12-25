'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useServers } from '../../hooks/useServers';
import { logger } from '../../lib/logger';
import { ServerList } from './_components/ServerList/ServerList';
import Header from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';

export default function ServersPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    servers,
    calendarCount,
    isLoading: isServersLoading,
    isError,
  } = useServers();

  useEffect(() => {
    logger.info('Servers page auth state:', {
      hasUser: !!user,
      isAuthLoading,
      userId: user?.id,
      localStorageDiscordId: localStorage.getItem('discord_id'),
    });

    if (!isAuthLoading && !user) {
      logger.log('No user found after auth loading, redirecting to login');
      router.replace('/login');
      return;
    }
  }, [user, isAuthLoading, router]);

  // 認証またはサーバーデータのロード中は何も表示しない
  if (isAuthLoading || isServersLoading) {
    return <LoadingScreen message='サーバ一覧を読み込んでいます...' />;
  }

  // エラー時はログインページにリダイレクト
  if (isError) {
    logger.error('Error loading servers, redirecting to login');
    router.replace('/login');
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-900'>
      <Header />
      <main className='container mx-auto px-4 py-24'>
        <ServerList servers={servers} calendarCount={calendarCount} />
      </main>
    </div>
  );
}
