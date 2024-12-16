'use client';

import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Gamepad2Icon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Discord OAuth2 URLを構築
    const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/discord/callback`
    );
    const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify+guilds+guilds.members.read`;

    window.location.href = DISCORD_AUTH_URL;
  };

  return (
    <div className='min-h-screen flex flex-col'>
      {/* ヘッダー */}
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

      {/* メインコンテンツ */}
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

          {/* 機能紹介 */}
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

      {/* フッター */}
      <footer className='border-t border-gray-800 py-4'>
        <div className='container mx-auto px-4'>
          <p className='text-center text-sm text-gray-500'>
            © 2024 GFC Scheduler. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
