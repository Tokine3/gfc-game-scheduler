'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import Image from 'next/image';
import { Gamepad2Icon } from 'lucide-react';
import { cn } from '../../lib/utils';

function LoginContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (error === 'auth_cancelled') {
      setErrorMessage('認証がキャンセルされました');
      setTimeout(() => setErrorMessage(''), 3000);
    } else if (error === 'auth_failed') {
      setErrorMessage('認証に失敗しました');
      setTimeout(() => setErrorMessage(''), 3000);
    } else if (searchParams.get('status') === 'success') {
      setErrorMessage('認証に成功しました');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [error, searchParams]);

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (!loading && user) {
      if (redirectPath) {
        sessionStorage.removeItem('redirectPath');
        router.push(redirectPath);
      } else {
        router.push('/servers');
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100' />
      </div>
    );
  }

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const fullPath = currentPath + currentSearch;

    if (currentPath !== '/login') {
      sessionStorage.setItem('redirectPath', fullPath);
    }

    const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/discord/callback`
    );

    const redirectPath = sessionStorage.getItem('redirectPath');
    const redirectQuery = redirectPath
      ? `&redirect=${encodeURIComponent(redirectPath)}`
      : '';

    const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify+guilds+guilds.members.read${redirectQuery}`;

    window.location.href = DISCORD_AUTH_URL;
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='border-b border-gray-800'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 relative'>
              <Image
                src='/GFC.png'
                alt='Logo'
                fill
                className='object-contain'
                priority
              />
            </div>
            <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
              GFC Scheduler
            </h1>
          </div>
        </div>
      </header>

      <main className='flex-1 flex items-center justify-center p-4'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center space-y-4'>
            <div className='flex justify-center'>
              <div className='p-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm'>
                <Gamepad2Icon className='w-12 h-12 text-purple-400' />
              </div>
            </div>
            <h2 className='text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
              GFCスケジューラーへようこそ
            </h2>
            <p className='text-gray-400'>
              ゲームの予定を簡単に管理・共有できるプラットフォーム
            </p>
          </div>

          <div className='bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800/50 p-6 space-y-6'>
            <div className='space-y-4'>
              <div className='text-center space-y-2'>
                <h3 className='text-lg font-medium text-gray-200'>
                  ログインして始める
                </h3>
                <p className='text-sm text-gray-400'>
                  Discordアカウントでログインして、GFCメンバーと予定を共有しましょう
                </p>
              </div>

              <Button
                onClick={handleLogin}
                className='w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-transparent transition-all duration-200'
              >
                <div className='w-6 h-6 relative mr-2'>
                  <Image
                    src='/discord-logo.svg'
                    alt='Discord'
                    fill
                    className='object-contain'
                  />
                </div>
                Discordでログイン
              </Button>
            </div>

            <div className='text-center'>
              <p className='text-xs text-gray-500'>
                ログインすることで、利用規約とプライバシーポリシーに同意したことになります
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8'>
            <div className='p-4 rounded-lg bg-gray-900/30 backdrop-blur-sm border border-gray-800/30'>
              <h3 className='font-medium text-gray-200 mb-2'>簡単な予定管理</h3>
              <p className='text-sm text-gray-400'>
                カレンダーで直感的に予定を管理できます
              </p>
            </div>
            <div className='p-4 rounded-lg bg-gray-900/30 backdrop-blur-sm border border-gray-800/30'>
              <h3 className='font-medium text-gray-200 mb-2'>
                リアルタイム共有
              </h3>
              <p className='text-sm text-gray-400'>
                メンバーと予定をリアルタイムで共有できます
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className='border-t border-gray-800 py-4'>
        <div className='container mx-auto px-4'>
          <p className='text-center text-sm text-gray-500'>
            © 2024 GFC Scheduler. All rights reserved.
          </p>
        </div>
      </footer>

      {errorMessage && (
        <div
          className={cn(
            'fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md transition-opacity duration-300',
            error
              ? 'bg-red-500/10 border border-red-500/30 text-red-200'
              : 'bg-green-500/10 border border-green-500/30 text-green-200'
          )}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100' />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
