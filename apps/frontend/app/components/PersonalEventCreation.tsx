'use client';

import { useState } from 'react';

import { User, CalendarIcon, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface PersonalEventCreationProps {
  onClose: () => void;
  date: Date | undefined;
}

export default function PersonalEventCreation({
  onClose,
  date,
}: PersonalEventCreationProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここでバックエンドにデータを送信します
    console.log({ title, date, notes });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] bg-gray-900 text-gray-100 border-gray-800'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center'>
            <User className='mr-2 h-6 w-6' />
            新規個人予定作成
          </DialogTitle>
          <DialogDescription className='text-gray-400'>
            個人予定の詳細を入力してください
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-gray-300'>
              タイトル
            </Label>
            <div className='relative'>
              <User className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
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
              className='bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700'
            >
              個人予定作成
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
