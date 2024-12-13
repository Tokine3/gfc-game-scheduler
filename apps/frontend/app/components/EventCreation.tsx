'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Crosshair, Users, CalendarIcon, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
    // ここでバックエンドにデータを送信します
    console.log({ title, date, quota, notes });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] bg-gray-900 text-gray-100 border-gray-800'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center'>
            <Crosshair className='mr-2 h-6 w-6' />
            新規イベント作成
          </DialogTitle>
          <DialogDescription className='text-gray-400'>
            イベントの詳細を入力してください
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-gray-300'>
              タイトル
            </Label>
            <div className='relative'>
              <Crosshair className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className='pl-8 bg-gray-800 border-gray-700 text-gray-100'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='date' className='text-gray-300'>
              日付
            </Label>
            <div className='relative'>
              <CalendarIcon className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                id='date'
                type='date'
                value={date?.toISOString().split('T')[0]}
                readOnly
                className='pl-8 bg-gray-800 border-gray-700 text-gray-100'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='quota' className='text-gray-300'>
              参加人数上限
            </Label>
            <div className='relative'>
              <Users className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                id='quota'
                type='number'
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                required
                className='pl-8 bg-gray-800 border-gray-700 text-gray-100'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='notes' className='text-gray-300'>
              メモ
            </Label>
            <div className='relative'>
              <FileText className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Textarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='pl-8 bg-gray-800 border-gray-700 text-gray-100'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='submit'
              className='bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
            >
              イベント作成
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
