'use client';

import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // マウント後にのみレンダリングを行う
  useEffect(() => {
    setMounted(true);
  }, []);

  // マウントされるまでは何も表示しない
  if (!mounted) {
    return (
      <header className='border-b border-gray-800'>
        <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <Image
              src='/GFC.png?height=32&width=32'
              alt='Logo'
              width={32}
              height={32}
            />
            <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
              FPS Game Scheduler
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='w-10 h-10' /> {/* プレースホルダー */}
            <Button
              variant='default'
              className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
            >
              Login with Discord
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className='border-b border-gray-800'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
          <Image
            src='/GFC.png?height=32&width=32'
            alt='Logo'
            width={32}
            height={32}
          />
          <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
            FPS Game Scheduler
          </h1>
        </div>
        <div className='flex items-center space-x-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <SunIcon className='h-[1.2rem] w-[1.2rem]' />
            ) : (
              <MoonIcon className='h-[1.2rem] w-[1.2rem]' />
            )}
          </Button>
          <Button
            variant='default'
            className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
          >
            Login with Discord
          </Button>
        </div>
      </div>
    </header>
  );
}
