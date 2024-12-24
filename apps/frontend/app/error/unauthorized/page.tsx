'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  LogIn,
  ServerIcon,
  ShieldX,
  AlertOctagon,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      {/* 装飾的な背景要素 */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute top-0 -left-4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
        <div className='absolute top-0 -right-4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-8 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000' />
        <div className='absolute bottom-0 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-6000' />
      </div>

      {/* ヘッダー */}
      <header className='fixed top-0 left-0 right-0 h-16 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/60'>
        <div className='container mx-auto px-4 h-full flex items-center'>
          <motion.div
            className='flex items-center gap-3'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-800/60 group'>
              <div className='absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:opacity-100 opacity-0 transition-opacity' />
              <Image
                src='/GFC.png'
                alt='Logo'
                fill
                sizes='20vw'
                className='object-cover relative z-10'
                priority
              />
            </div>
            <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
              GFC Scheduler
            </h1>
          </motion.div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className='flex-1 container mx-auto px-4 flex items-center justify-center'>
        <motion.div
          className='w-full max-w-2xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='relative p-8 rounded-2xl overflow-hidden'>
            {/* カード背景 */}
            <div className='absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl' />

            {/* コンテンツ */}
            <div className='relative space-y-8'>
              <div className='flex flex-col items-center text-center space-y-6'>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className='relative'
                >
                  <div className='w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center ring-1 ring-red-500/30 shadow-lg shadow-red-500/20'>
                    <ShieldX className='w-12 h-12 text-red-400' />
                  </div>
                  <div className='absolute -top-2 -right-2'>
                    <AlertOctagon className='w-6 h-6 text-orange-400 animate-pulse' />
                  </div>
                </motion.div>

                <div className='space-y-3'>
                  <h2 className='text-3xl sm:text-4xl font-bold'>
                    <span className='bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400'>
                      アクセス権限がありません
                    </span>
                  </h2>
                  <p className='text-gray-400 max-w-md text-base sm:text-lg'>
                    このカレンダーにアクセスするには、
                    <br />
                    対応するDiscordサーバのメンバーである必要があります。
                  </p>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
                <Button
                  onClick={() => router.back()}
                  variant='outline'
                  className='border-gray-700 hover:bg-gray-800/60 h-12 px-6'
                >
                  <ArrowLeft className='mr-2 h-5 w-5' />
                  前のページへ
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className='bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20 h-12 px-6'
                >
                  <LogIn className='mr-2 h-5 w-5' />
                  ログインページへ
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* フッター */}
      <footer className='relative z-10 border-t border-gray-800/60 bg-gray-900/95 backdrop-blur-md py-8'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-center gap-2'>
            <div className='relative w-6 h-6 rounded-lg overflow-hidden'>
              <Image
                src='/GFC.png'
                alt='Logo'
                fill
                sizes='20vw'
                className='object-cover'
              />
            </div>
            <p className='text-sm text-gray-400'>
              © 2024 GFC Scheduler. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
