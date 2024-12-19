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
import { Calendar, User, Users, Star, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvailableUsersProps {
  users: Array<{
    id: string;
    name: string;
    avatar: string | null;
    isJoined: boolean;
  }>;
  date: string;
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
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 max-w-md'>
        <DialogHeader className='pb-4 border-b border-gray-800'>
          <DialogTitle className='flex items-center gap-3 text-xl font-bold text-gray-100'>
            <div className='p-2 rounded-md bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20'>
              <Calendar className='w-5 h-5' />
            </div>
            <div>
              {new Date(date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </DialogTitle>
          <DialogDescription className='flex items-center justify-center gap-2 text-gray-400 pt-2'>
            <Users className='w-4 h-4' />
            空き予定のあるメンバー ({users.length}人)
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='space-y-2 py-4 max-h-[60vh] overflow-y-auto pr-2'
        >
          <AnimatePresence>
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 }}
                className='group relative flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/5'
              >
                <div className='flex-shrink-0 relative'>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={cn(
                        'w-10 h-10 rounded-full border-2 transition-colors',
                        user.isJoined
                          ? 'border-emerald-500/50 group-hover:border-emerald-500/70'
                          : 'border-gray-700 group-hover:border-violet-500/50'
                      )}
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-gray-600 transition-colors'>
                      <User className='w-5 h-5 text-gray-400' />
                    </div>
                  )}
                  <div
                    className={cn(
                      'absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center',
                      user.isJoined
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-violet-500/20 border border-violet-500/30'
                    )}
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        user.isJoined ? 'bg-emerald-400' : 'bg-violet-400'
                      )}
                    ></div>
                  </div>
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium text-gray-200 group-hover:text-gray-100 transition-colors'>
                    {user.name}
                  </p>
                  {user.isJoined && (
                    <p className='text-xs text-emerald-400/80'>参加済み</p>
                  )}
                </div>
                <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  {!user.isJoined && (
                    <button className='p-1.5 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-violet-400 transition-colors'>
                      <Star className='w-4 h-4' />
                    </button>
                  )}
                  <button className='p-1.5 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-violet-400 transition-colors'>
                    <Mail className='w-4 h-4' />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <DialogFooter className='pt-4 border-t border-gray-800'>
          <Button
            variant='outline'
            onClick={handleClose}
            className='w-full sm:w-auto border-gray-700 hover:bg-gray-800 gap-2'
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
