'use client';

import { FC } from 'react';
import { useLogout } from '../hooks/useLogout';
import { LogOut } from 'lucide-react';
import { Button } from '../app/components/ui/button';

export const LogoutButton: FC = () => {
  const { logout } = useLogout();

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={logout}
      className='text-gray-400 hover:text-gray-100'
    >
      <LogOut className='w-4 h-4 mr-2' />
      ログアウト
    </Button>
  );
};
