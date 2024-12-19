'use client';

import { CalendarDays, LogOut, Plus, ServerIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/discord/callback`
    );
    const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds`;

    window.location.href = DISCORD_AUTH_URL;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 h-16 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/60',
        'before:absolute before:inset-0 before:bg-gradient-to-b before:from-gray-900 before:to-transparent before:opacity-50 before:-z-10',
        className
      )}
    >
      <div className='container mx-auto px-4 h-full flex items-center justify-between'>
        {/* ロゴ部分 */}
        <button
          onClick={() => router.push('/servers')}
          className='flex items-center gap-3 group'
        >
          <div className='relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-800/60 transition-all group-hover:ring-violet-500/50 group-hover:scale-105'>
            <div className='absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity' />
            <Image src='/GFC.png' alt='Logo' fill className='object-cover' />
          </div>
          <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-600'>
            GFC Scheduler
          </h1>
        </button>

        {/* 右側のボタン群 */}
        <div className='flex items-center gap-2'>
          {user ? (
            <>
              {/* サーバー一覧ボタン */}
              <Button
                variant='outline'
                size='sm'
                onClick={() => router.push('/servers')}
                className='h-9 border-gray-700 hover:bg-gray-800/60 hover:border-violet-500/50 whitespace-nowrap group transition-all hidden sm:flex'
              >
                <div className='p-1 rounded-md bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors'>
                  <ServerIcon className='w-4 h-4' />
                </div>
                <span className='ml-2 text-gray-300 group-hover:text-gray-100 transition-colors'>
                  サーバー一覧
                </span>
              </Button>

              {/* ログアウトボタン */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={handleLogout}
                      className='h-9 w-9 border-gray-700 hover:bg-gray-800/60 hover:text-red-400 hover:border-red-500/50 transition-all'
                    >
                      <LogOut className='h-4 w-4' />
                      <span className='sr-only'>ログアウト</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side='bottom'
                    className='bg-gray-800 border-gray-700'
                  >
                    <p>ログアウト</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <Button
              onClick={handleLogin}
              className='bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20 transition-all'
            >
              <div className='w-5 h-5 relative mr-2'>
                <Image
                  src='/discord-logo.svg'
                  alt='Discord'
                  fill
                  className='object-contain'
                />
              </div>
              Login with Discord
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
