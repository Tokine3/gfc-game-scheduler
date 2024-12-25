'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useServers } from '../../hooks/useServers';
import { logger } from '../../lib/logger';
import { ServerList } from './_components/ServerList/ServerList';

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
    return null;
  }

  // エラー時はログインページにリダイレクト
  if (isError) {
    logger.error('Error loading servers, redirecting to login');
    router.replace('/login');
    return null;
  }

  return <ServerList servers={servers} calendarCount={calendarCount} />;
}
