'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  CrosshairIcon,
  CalendarIcon,
  FileTextIcon,
  UsersIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import { client } from '../../lib/api';
import { logger } from '../../lib/logger';

interface EventCreationProps {
  onClose: () => void;
  date: Date | undefined;
}

export default function EventCreation({ onClose, date }: EventCreationProps) {
  const [title, setTitle] = useState('');
  const [quota, setQuota] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.schedules.public.post({
        body: {
          date: dayjs(date).format('YYYY-MM-DD'),
          title,
          description: notes,
          recruitCount: parseInt(quota),
        },
      });
      onClose();
    } catch (error) {
      logger.error('Failed to create event:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] bg-gray-900/95 backdrop-blur-md border-gray-800'>
        <DialogHeader className='space-y-4'>
          <div className='mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl border border-purple-500/20'>
            <CrosshairIcon className='h-6 w-6 text-purple-400' />
          </div>
          <DialogTitle className='text-xl font-bold text-center text-gray-100'>
            新規イベント作成
          </DialogTitle>
          <DialogDescription className='text-center text-gray-400'>
            みんなで参加できるイベントを作成します
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6 mt-4'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label className='text-gray-200'>タイトル</Label>
              <div className='relative'>
                <CrosshairIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400' />
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className='pl-10 bg-gray-800/50 border-gray-700 focus:border-purple-500 text-gray-100'
                  placeholder='イベント名を入力'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-gray-200'>日付</Label>
              <div className='relative'>
                <CalendarIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400' />
                <Input
                  type='date'
                  value={dayjs(date).format('YYYY-MM-DD')}
                  readOnly
                  className='pl-10 bg-gray-800/50 border-gray-700 text-gray-100'
                />
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-gray-200'>参加人数上限</Label>
            <div className='relative'>
              <UsersIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400' />
              <Input
                type='number'
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                required
                min='1'
                className='pl-10 bg-gray-800/50 border-gray-700 focus:border-purple-500 text-gray-100'
                placeholder='参加可能な最大人数'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-gray-200'>メモ</Label>
            <div className='relative'>
              <FileTextIcon className='absolute left-3 top-3 h-4 w-4 text-purple-400' />
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='pl-10 min-h-[100px] bg-gray-800/50 border-gray-700 focus:border-purple-500 text-gray-100'
                placeholder='イベントの詳細や注意事項など'
              />
            </div>
          </div>

          <DialogFooter>
            <div className='flex w-full flex-col-reverse sm:flex-row sm:justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='w-full sm:w-auto border-gray-700 hover:bg-gray-800 text-gray-300'
              >
                キャンセル
              </Button>
              <Button
                type='submit'
                className='w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25'
              >
                イベントを作成
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
