'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ServerIcon, ShieldX } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
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
        <div className='max-w-md w-full space-y-6'>
          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center space-y-4'>
            <div className='w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center'>
              <ShieldX className='w-10 h-10 text-red-400' />
            </div>

            <h2 className='text-2xl font-semibold text-gray-100'>
              アクセス権限がありません
            </h2>

            <p className='text-gray-400'>
              このカレンダーにアクセスするには、対応するDiscordサーバーのメンバーである必要があります。
            </p>

            <div className='pt-6 flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                variant='outline'
                className='border-gray-700 hover:bg-gray-800 text-gray-200'
                onClick={() => router.push('/login')}
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                ログインページへ
              </Button>
              <Button
                className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                onClick={() => router.push('/servers')}
              >
                <ServerIcon className='mr-2 h-4 w-4' />
                サーバー選択へ
              </Button>
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
