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
import { CrosshairIcon, UserIcon } from 'lucide-react';

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
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle className='text-center'>予定の種類を選択</DialogTitle>
          <DialogDescription className='text-center'>
            作成する予定の種類を選択してください
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
          <Button
            onClick={onSelectEvent}
            className='h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600'
          >
            <CrosshairIcon className='h-8 w-8' />
            <span className='text-lg'>イベント作成</span>
            <span className='text-xs opacity-80'>みんなで参加できる予定</span>
          </Button>
          <Button
            onClick={onSelectPersonal}
            className='h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
          >
            <UserIcon className='h-8 w-8' />
            <span className='text-lg'>個人予定作成</span>
            <span className='text-xs opacity-80'>自分だけの予定</span>
          </Button>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full sm:w-auto border-gray-700 hover:bg-gray-800'
          >
            キャンセル
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
