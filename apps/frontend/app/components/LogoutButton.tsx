'use client';

import { FC } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useLogout } from '../../hooks/useLogout';
import { toast } from './ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export const LogoutButton: FC = () => {
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.setItem('logoutSuccess', 'true');
    } catch (error) {
      toast({
        title: 'ログアウトに失敗しました',
        description: 'もう一度お試しください',
        className:
          'bg-gray-900/95 border border-gray-800/60 backdrop-blur-md fixed top-4 left-1/2 transform -translate-x-1/2',
      });
    }
  };

  return (
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
        <TooltipContent side='bottom' className='bg-gray-800 border-gray-700'>
          <p>ログアウト</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
