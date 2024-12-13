'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/custom-label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/custom-button';
import {
  CrosshairIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // ESCキーでモーダルを閉じる
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, date, quota, notes });
    onClose();
  };

  if (!mounted) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='relative bg-gray-900 text-gray-100 border border-gray-800 rounded-lg w-full max-w-[425px] p-6'>
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-200'
        >
          ✕
        </button>

        {/* Header */}
        <div className='mb-6'>
          <h2 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center'>
            <CrosshairIcon className='mr-2 h-6 w-6' />
            新規イベント作成
          </h2>
          <p className='text-gray-400'>イベントの詳細を入力してください</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-gray-300'>
              タイトル
            </Label>
            <div className='relative'>
              <CrosshairIcon className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
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
                value={dayjs(date).format('YYYY-MM-DD')}
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
              <UsersIcon className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
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
              <FileTextIcon className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Textarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='pl-8 bg-gray-800 border-gray-700 text-gray-100'
              />
            </div>
          </div>

          {/* Footer */}
          <div className='flex justify-end pt-4'>
            <Button
              type='submit'
              className='bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
            >
              イベント作成
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
