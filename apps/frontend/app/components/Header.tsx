'use client';

import { MoonIcon, SunIcon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
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

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    // Discord OAuth2 URLを構築
    const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/discord/callback`
    );
    const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds`;

    window.location.href = DISCORD_AUTH_URL;
  };

  const handleLogout = () => {
    // ログアウト処理
    localStorage.removeItem('token');
    router.push('/');
  };

  if (!mounted) {
    return (
      <header
        className={cn(
          'fixed top-0 left-0 right-0 h-16 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/60',
          'before:absolute before:inset-0 before:bg-gradient-to-b before:from-gray-900 before:to-transparent before:opacity-50 before:-z-10',
          className
        )}
      >
        <div className='container mx-auto px-4 h-full flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-800/60'>
              <Image src='/GFC.png' alt='Logo' fill className='object-cover' />
            </div>
            <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
              GFC Scheduler
            </h1>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10' />
            <Button
              variant='default'
              className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/20'
            >
              Login with Discord
            </Button>
          </div>
        </div>
      </header>
    );
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
        <div className='flex items-center gap-3'>
          <div className='relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-800/60 transition-transform hover:scale-105'>
            <Image src='/GFC.png' alt='Logo' fill className='object-cover' />
          </div>
          <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
            GFC Scheduler
          </h1>
        </div>
        <div className='flex items-center gap-3'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={handleLogout}
                  className='h-9 w-9 border-gray-700 hover:bg-gray-800 hover:text-red-400 transition-all'
                >
                  <LogOut className='h-4 w-4' />
                  <span className='sr-only'>Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>ログアウト</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            onClick={handleLogin}
            className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/20 transition-all'
          >
            <div className='w-5 h-5 relative mr-2'>
              <Image
                src='/discord-logo.svg'
                alt='Discord'
                fill
                className='object-contain'
              />
            </div>
            <p className='text-sm text-white'>Login with Discord</p>
          </Button>
        </div>
      </div>
    </header>
  );
}
