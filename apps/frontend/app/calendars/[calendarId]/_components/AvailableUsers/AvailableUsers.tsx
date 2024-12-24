'use client';

import { FC, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCard } from './_components';

interface Props {
  users: Array<{
    id: string;
    name: string;
    avatar: string | null;
    isJoined: boolean;
  }>;
  date: string;
  onClose: () => void;
}

export const AvailableUsers: FC<Props> = ({ users, date, onClose }) => {
  const handleClose = useCallback(() => {
    Promise.resolve().then(onClose);
  }, [onClose]);

  const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 max-w-md'>
        <DialogHeader className='pb-4 border-b border-gray-800'>
          <DialogTitle className='flex items-center gap-3 text-xl font-bold text-gray-100'>
            <div className='p-2 rounded-md bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20'>
              <Calendar className='w-5 h-5' />
            </div>
            <div>{formattedDate}</div>
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
              <UserCard key={user.id} user={user} index={i} />
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
};

export default AvailableUsers;
