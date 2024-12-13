'use client';

import {
  CheckIcon,
  XIcon,
  HelpCircleIcon,
  CalendarIcon,
  Users,
  User,
  Crosshair,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface Event {
  id: number;
  title: string;
  date: Date;
  participants?: number;
  quota?: number;
  isPersonal: boolean;
}

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  const handleReaction = (reaction: string) => {
    // ここでバックエンドとDiscordに反応を送信します
    console.log(`反応: ${reaction}`);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] bg-gray-900 text-gray-100 border-gray-800'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center justify-center'>
            {event.isPersonal ? (
              <User className='mr-2 h-6 w-6' />
            ) : (
              <Crosshair className='mr-2 h-6 w-6' />
            )}
            {event.title}
          </DialogTitle>
          <DialogDescription className='text-gray-400 flex items-center justify-center'>
            {event.isPersonal ? '個人予定の詳細' : 'イベントの詳細'}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='flex items-center space-x-2 text-gray-300'>
            <CalendarIcon className='h-4 w-4' />
            <p>日付：{event.date.toLocaleDateString('ja-JP')}</p>
          </div>
          {!event.isPersonal &&
            event.participants !== undefined &&
            event.quota !== undefined && (
              <>
                <div className='flex items-center space-x-2 text-gray-300'>
                  <Users className='h-4 w-4' />
                  <p>
                    参加人数：{event.participants} / {event.quota}
                  </p>
                </div>
                <Progress
                  value={(event.participants / event.quota) * 100}
                  className='w-full h-2 rounded-full overflow-hidden bg-gray-800/30'
                  style={{
                    background: 'transparent',
                  }}
                  indicatorStyle={{
                    background: 'linear-gradient(to right, #22C55E, #4ADE80)',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <div className='flex justify-between'>
                  <Button
                    onClick={() => handleReaction('join')}
                    className='flex-1 mr-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
                  >
                    <CheckIcon className='mr-2 h-4 w-4' /> 参加
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => handleReaction('maybe')}
                    className='flex-1 mx-2 border-gray-700 hover:bg-gray-800'
                  >
                    <HelpCircleIcon className='mr-2 h-4 w-4' /> 未定
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => handleReaction('decline')}
                    className='flex-1 ml-2 border-gray-700 hover:bg-gray-800'
                  >
                    <XIcon className='mr-2 h-4 w-4' /> 不参加
                  </Button>
                </div>
              </>
            )}
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            className='border-gray-700 hover:bg-gray-800'
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
