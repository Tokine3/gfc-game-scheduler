'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { CrosshairIcon, UserIcon, CalendarDays } from 'lucide-react';

interface EventTypeSelectorProps {
  onClose: () => void;
  onSelectPersonal: () => void;
  onSelectEvent: () => void;
}

export default function EventTypeSelector({
  onClose,
  onSelectPersonal,
  onSelectEvent,
}: EventTypeSelectorProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] bg-gray-900/95 backdrop-blur-md border-gray-800'>
        <DialogHeader className='space-y-4'>
          <div className='mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl border border-purple-500/20'>
            <CalendarDays className='h-6 w-6 text-purple-400' />
          </div>
          <DialogTitle className='text-xl font-bold text-center text-gray-100'>
            予定の種類を選択
          </DialogTitle>
          <DialogDescription className='text-center text-gray-400'>
            作成する予定の種類を選択してください
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
          <button
            onClick={onSelectEvent}
            className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6 transition-all hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1'
          >
            <div className='relative z-10 flex flex-col items-center gap-4'>
              <div className='p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500'>
                <CrosshairIcon className='h-6 w-6 text-white' />
              </div>
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-gray-100 mb-1'>
                  イベント作成
                </h3>
                <p className='text-sm text-gray-400'>みんなで参加できる予定</p>
              </div>
            </div>
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 transition-all group-hover:from-purple-500/5 group-hover:to-pink-500/5' />
          </button>

          <button
            onClick={onSelectPersonal}
            className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6 transition-all hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1'
          >
            <div className='relative z-10 flex flex-col items-center gap-4'>
              <div className='p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500'>
                <UserIcon className='h-6 w-6 text-white' />
              </div>
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-gray-100 mb-1'>
                  個人予定作成
                </h3>
                <p className='text-sm text-gray-400'>自分だけの予定</p>
              </div>
            </div>
            <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 transition-all group-hover:from-cyan-500/5 group-hover:to-blue-500/5' />
          </button>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full sm:w-auto border-gray-700 hover:bg-gray-800 text-gray-300'
          >
            キャンセル
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
