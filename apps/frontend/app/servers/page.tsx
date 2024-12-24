'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/LoadingScreen';
import Header from '../components/Header';
import { useServers } from '../../hooks/useServers';
import { ServerList } from './_components/ServerList/ServerList';

export default function ServersPage() {
  const { user, loading: authLoading } = useAuth();
  const { servers, calendarCount, isLoading, isError } = useServers();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || isLoading) {
    return <LoadingScreen message='サーバー一覧を読み込んでいます...' />;
  }

  if (isError) {
    router.replace('/error');
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-900'>
      <Header />
      <main className='container mx-auto px-4 py-8'>
        <ServerList servers={servers} calendarCount={calendarCount} />
      </main>
    </div>
  );
}
