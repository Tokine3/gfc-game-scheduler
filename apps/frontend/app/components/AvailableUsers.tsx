'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCallback } from 'react';

interface AvailableUsersProps {
  users: {
    id: number;
    name: string;
    avatarUrl?: string;
  }[];
  date: Date;
  onClose: () => void;
}

export default function AvailableUsers({
  users,
  date,
  onClose,
}: AvailableUsersProps) {
  const handleClose = useCallback(() => {
    Promise.resolve().then(() => {
      onClose();
    });
  }, [onClose]);

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center'>
            {date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            の予定空きユーザー
          </DialogTitle>
          <DialogDescription className='text-center'>
            この日に予定が空いているユーザーの一覧です
          </DialogDescription>
        </DialogHeader>
        <div className='divide-y divide-gray-800'>
          {users.map((user) => (
            <div key={user.id} className='flex items-center gap-3 py-3 px-1'>
              <div className='flex-shrink-0'>
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className='w-8 h-8 rounded-full border border-gray-700'
                  />
                ) : (
                  <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center'>
                    <User className='w-4 h-4 text-gray-400' />
                  </div>
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium text-gray-200'>{user.name}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleClose}
            className='w-full sm:w-auto border-gray-700 hover:bg-gray-800'
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
