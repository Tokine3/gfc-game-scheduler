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

interface EventCreationProps {
  onClose: () => void;
  date: Date | undefined;
}

export default function EventCreation({ onClose, date }: EventCreationProps) {
  const [title, setTitle] = useState('');
  const [quota, setQuota] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, date, quota, notes });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-center gap-2'>
            <CrosshairIcon className='h-6 w-6' />
            新規イベント作成
          </DialogTitle>
          <DialogDescription>
            イベントの詳細を入力してください
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='title'>タイトル</Label>
              <div className='relative'>
                <CrosshairIcon className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
                <Input
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className='pl-8'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='date'>日付</Label>
              <div className='relative'>
                <CalendarIcon className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
                <Input
                  id='date'
                  type='date'
                  value={date?.toISOString().split('T')[0]}
                  readOnly
                  className='pl-8'
                />
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='quota'>参加人数上限</Label>
            <div className='relative'>
              <UsersIcon className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                id='quota'
                type='number'
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                required
                className='pl-8'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='notes'>メモ</Label>
            <div className='relative'>
              <FileTextIcon className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Textarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='pl-8 min-h-[100px]'
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type='submit'
              className='w-full sm:w-auto bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
            >
              イベント作成
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
