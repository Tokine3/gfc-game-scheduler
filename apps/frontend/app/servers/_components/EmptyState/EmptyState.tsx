'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { ServerIcon, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface EmptyStateProps {
  onShowAll: () => void;
}

export const EmptyState: FC<EmptyStateProps> = ({ onShowAll }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col items-center justify-center p-8 rounded-xl bg-gray-800/50 border border-gray-700/50 text-center space-y-4'
    >
      <div className='p-4 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-violet-400'>
        <ServerIcon className='w-12 h-12' />
      </div>
      
      <div className='space-y-2'>
        <h3 className='text-xl font-semibold text-gray-100'>
          まだ参加しているサーバーがありません
        </h3>
        <p className='text-gray-400 max-w-sm'>
          サーバーに参加して、カレンダーを作成しましょう
        </p>
      </div>

      <Button
        onClick={onShowAll}
        className='mt-4 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
      >
        すべてのサーバーを表示
        <ArrowRight className='w-4 h-4 ml-2' />
      </Button>
    </motion.div>
  );
}; 