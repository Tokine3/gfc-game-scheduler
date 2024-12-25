'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/LoadingScreen';
import Header from '../components/Header';
import { useServers } from '../../hooks/useServers';
import { ServerList } from './_components/ServerList/ServerList';
import { toast } from '../components/ui/use-toast';

/**
 * @description サーバー一覧ページ
 * 認証されていないユーザーはログインページにリダイレクトされる
 */
export default function ServersPage() {
  const { user, loading: authLoading } = useAuth();
  const { servers, calendarCount, error, isLoading } = useServers();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'エラー',
        description: 'サーバー一覧の取得に失敗しました',
        variant: 'destructive',
      });
      router.replace('/error');
    }
  }, [error, router]);

  if (authLoading || isLoading) {
    return <LoadingScreen message='サーバ一覧を読み込んでいます...' />;
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
