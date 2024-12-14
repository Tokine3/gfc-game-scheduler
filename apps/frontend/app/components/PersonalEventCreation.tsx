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
import { User, CalendarIcon, FileText } from 'lucide-react';

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
    console.log({ title, date, notes });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-center gap-2'>
            <User className='h-6 w-6' />
            新規個人予定作成
          </DialogTitle>
          <DialogDescription>
            個人予定の詳細を入力してください
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='title'>タイトル</Label>
              <div className='relative'>
                <User className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
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
            <Label htmlFor='notes'>メモ</Label>
            <div className='relative'>
              <FileText className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Textarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='pl-8 min-h-[100px]'
              />
            </div>
          </div>

          <DialogFooter>
            <div className='flex w-full flex-col-reverse sm:flex-row sm:justify-end gap-2'>
              <Button
                variant='outline'
                onClick={onClose}
                className='w-full sm:w-auto border-gray-700 hover:bg-gray-800'
              >
                キャンセル
              </Button>
              <Button
                type='submit'
                className='w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
              >
                予定作成
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
