'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CrosshairIcon, UserIcon, Gamepad2, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface EventTypeSelectorProps {
  onClose: () => void;
  onSelectEvent: () => void;
  onSelectPersonal: () => void;
}

export default function EventTypeSelector({
  onClose,
  onSelectEvent,
  onSelectPersonal,
}: EventTypeSelectorProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-100 flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/20'>
              <Gamepad2 className='w-5 h-5 text-violet-400' />
            </div>
            イベントの種類を選択
          </DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant='outline'
              onClick={onSelectEvent}
              className={cn(
                'w-full h-auto p-4',
                'bg-gradient-to-r from-gray-900/50 to-gray-800/50',
                'hover:from-violet-500/10 hover:to-indigo-500/10',
                'border border-violet-500/20 hover:border-violet-500/30',
                'group relative overflow-hidden transition-all'
              )}
            >
              <div className='absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity' />
              <div className='flex items-start gap-4'>
                <div className='relative'>
                  <div className='p-3 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 group-hover:text-violet-300 transition-colors'>
                    <CrosshairIcon className='w-6 h-6' />
                  </div>
                  <div className='absolute -bottom-1 -right-1 p-1.5 rounded-md bg-violet-500 text-white shadow-lg shadow-violet-500/20'>
                    <Users className='w-3 h-3' />
                  </div>
                </div>
                <div className='text-left'>
                  <div className='font-semibold text-gray-100 group-hover:text-violet-100 mb-1'>
                    ゲームイベント
                  </div>
                  <div className='text-sm text-gray-400 group-hover:text-gray-300'>
                    参加者を募集して一緒にプレイするイベントを作成します。
                    募集人数や説明を設定できます。
                  </div>
                  <div className='flex items-center gap-2 mt-3 text-xs text-violet-400/75'>
                    <div className='px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20'>
                      参加者募集
                    </div>
                    <div className='px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20'>
                      チーム練習
                    </div>
                  </div>
                </div>
              </div>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Button
              variant='outline'
              onClick={onSelectPersonal}
              className={cn(
                'w-full h-auto p-4',
                'bg-gradient-to-r from-gray-900/50 to-gray-800/50',
                'hover:from-purple-500/10 hover:to-pink-500/10',
                'border border-purple-500/20 hover:border-purple-500/30',
                'group relative overflow-hidden transition-all'
              )}
            >
              <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity' />
              <div className='flex items-start gap-4'>
                <div className='relative'>
                  <div className='p-3 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors'>
                    <UserIcon className='w-6 h-6' />
                  </div>
                  <div className='absolute -bottom-1 -right-1 p-1.5 rounded-md bg-purple-500 text-white shadow-lg shadow-purple-500/20'>
                    <Gamepad2 className='w-3 h-3' />
                  </div>
                </div>
                <div className='text-left'>
                  <div className='font-semibold text-gray-100 group-hover:text-purple-100 mb-1'>
                    個人予定
                  </div>
                  <div className='text-sm text-gray-400 group-hover:text-gray-300'>
                    自分の練習予定や空き時間を登録します。
                    他のメンバーに予定を共有できます。
                  </div>
                  <div className='flex items-center gap-2 mt-3 text-xs text-purple-400/75'>
                    <div className='px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20'>
                      個人練習
                    </div>
                    <div className='px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20'>
                      空き時間
                    </div>
                  </div>
                </div>
              </div>
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
