'use client';

import { Button } from '../ui/button';
import { useState } from 'react';
import AvailableUsers from '../AvailableUsers';
import { Users } from 'lucide-react';

export default function AvailableUsersMock() {
  const [isOpen, setIsOpen] = useState(false);

  // モックユーザーデータ
  const mockUsers = [
    {
      id: '1',
      name: '山田 太郎',
      avatar: null,
      isJoined: true,
    },
    {
      id: '2',
      name: '鈴木 花子',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      isJoined: true,
    },
    {
      id: '3',
      name: '佐藤 次郎',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      isJoined: false,
    },
    {
      id: '4',
      name: '田中 美咲',
      avatar: null,
      isJoined: false,
    },
    {
      id: '5',
      name: '伊藤 健一',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      isJoined: true,
    },
  ];

  return (
    <div className='p-8 space-y-4'>
      <div className='max-w-md mx-auto space-y-4'>
        <h1 className='text-2xl font-bold text-gray-100'>
          空き予定ユーザーモーダル
        </h1>
        <p className='text-gray-400'>
          このモックは空き予定ユーザーを表示するモーダルのデモです。
        </p>
        <Button
          onClick={() => setIsOpen(true)}
          className='w-full bg-violet-500 hover:bg-violet-600 text-white gap-2'
        >
          <Users className='w-4 h-4' />
          空き予定ユーザーを表示
        </Button>
      </div>

      {isOpen && (
        <AvailableUsers
          users={mockUsers}
          date='2024-01-20'
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
