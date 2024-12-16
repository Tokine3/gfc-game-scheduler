'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function Header() {
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
              GFC Scheduler
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='w-10 h-10' />
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
      <div className='container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0'>
        <div className='flex items-center space-x-2'>
          <Image
            src='/GFC.png?height=32&width=32'
            alt='Logo'
            width={32}
            height={32}
          />
          <h1 className='text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
            GFC Scheduler
          </h1>
        </div>
        <div className='flex items-center space-x-4 w-full sm:w-auto'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='border-gray-700 hover:bg-gray-800'
          >
            {theme === 'dark' ? (
              <SunIcon className='h-[1.2rem] w-[1.2rem]' />
            ) : (
              <MoonIcon className='h-[1.2rem] w-[1.2rem]' />
            )}
            <span className='sr-only'>Toggle theme</span>
          </Button>
          <Button
            onClick={handleLogin}
            className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-transparent transition-all duration-200'
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
        </div>
      </div>
    </header>
  );
}
