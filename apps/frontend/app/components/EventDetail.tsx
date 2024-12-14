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
import dayjs from 'dayjs';
import { cn } from '../../lib/utils';
import type { Event, Participant } from './Calendar';

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

// 参加状態に応じたバッジコンポーネント
function StatusBadge({ status }: { status: Participant['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        status === 'join' &&
          'bg-green-500/20 text-green-200 border border-green-500/30',
        status === 'maybe' &&
          'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30',
        status === 'decline' &&
          'bg-red-500/20 text-red-200 border border-red-500/30'
      )}
    >
      {status === 'join' && '参加'}
      {status === 'maybe' && '未定'}
      {status === 'decline' && '不参加'}
    </span>
  );
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  const handleReaction = (reaction: string) => {
    console.log(`反応: ${reaction}`);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-center gap-2 text-lg sm:text-xl'>
            {event.isPersonal ? (
              <User className='h-5 w-5 sm:h-6 sm:w-6' />
            ) : (
              <Crosshair className='h-5 w-5 sm:h-6 sm:w-6' />
            )}
            {event.title}
          </DialogTitle>
          <DialogDescription className='text-center text-sm sm:text-base'>
            {event.isPersonal ? '個人予定の詳細' : 'イベントの詳細'}
          </DialogDescription>
          <div className='flex items-center justify-center gap-2 mt-2'>
            {event.creator.avatarUrl ? (
              <img
                src={event.creator.avatarUrl}
                alt={event.creator.name}
                className='w-6 h-6 rounded-full border border-gray-700'
              />
            ) : (
              <div className='w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center'>
                <User className='w-3 h-3 text-gray-400' />
              </div>
            )}
            <span className='text-sm text-gray-400'>
              作成者: {event.creator.name}
            </span>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-4 text-gray-300'>
            <div className='flex items-center space-x-2'>
              <CalendarIcon className='h-4 w-4 flex-shrink-0' />
              <p>日付：{dayjs(event.date).format('YYYY/MM/DD')}</p>
            </div>

            {!event.isPersonal && event.participants && event.quota && (
              <div className='flex items-center space-x-2'>
                <Users className='h-4 w-4 flex-shrink-0' />
                <p>
                  参加人数：{event.participants.length} / {event.quota}
                </p>
              </div>
            )}
          </div>

          {!event.isPersonal && event.participants && event.quota && (
            <>
              <div className='flex items-center justify-between text-gray-300'>
                <div className='flex items-center space-x-2'>
                  <Users className='h-4 w-4' />
                  <p>
                    参加人数：{event.participants.length} / {event.quota}
                  </p>
                </div>
                <div className='flex items-center space-x-2 text-sm'>
                  <span className='text-green-400'>
                    {
                      event.participants.filter((p) => p.status === 'join')
                        .length
                    }{' '}
                    参加
                  </span>
                  <span className='text-yellow-400'>
                    {
                      event.participants.filter((p) => p.status === 'maybe')
                        .length
                    }{' '}
                    未定
                  </span>
                  <span className='text-red-400'>
                    {
                      event.participants.filter((p) => p.status === 'decline')
                        .length
                    }{' '}
                    不参加
                  </span>
                </div>
              </div>

              <Progress
                value={(event.participants.length / event.quota) * 100}
                className='w-full h-2 rounded-full overflow-hidden bg-gray-800/30'
                style={{
                  background: 'transparent',
                }}
                indicatorStyle={{
                  background: 'linear-gradient(to right, #22C55E, #4ADE80)',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              />

              <div className='border border-gray-800 rounded-lg overflow-hidden'>
                <div className='p-3 bg-gray-900/50 border-b border-gray-800'>
                  <h4 className='text-sm font-medium text-gray-200'>
                    参加者一覧
                  </h4>
                </div>
                <div className='divide-y divide-gray-800 max-h-[40vh] overflow-y-auto'>
                  {event.participants?.map((participant) => (
                    <div
                      key={participant.id}
                      className='flex items-center justify-between p-3 hover:bg-gray-800/50'
                    >
                      <div className='flex items-center space-x-3 min-w-0'>
                        {participant.avatarUrl ? (
                          <img
                            src={participant.avatarUrl}
                            alt={participant.name}
                            className='w-8 h-8 rounded-full flex-shrink-0'
                          />
                        ) : (
                          <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0'>
                            <User className='w-4 h-4 text-gray-400' />
                          </div>
                        )}
                        <span className='text-sm text-gray-200 truncate'>
                          {participant.name}
                        </span>
                      </div>
                      <StatusBadge status={participant.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-2'>
                <Button
                  onClick={() => handleReaction('join')}
                  className='w-full sm:flex-1 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
                >
                  <CheckIcon className='mr-2 h-4 w-4' /> 参加
                </Button>
                <Button
                  variant='outline'
                  onClick={() => handleReaction('maybe')}
                  className='w-full sm:flex-1 border-gray-700 hover:bg-gray-800'
                >
                  <HelpCircleIcon className='mr-2 h-4 w-4' /> 未定
                </Button>
                <Button
                  variant='outline'
                  onClick={() => handleReaction('decline')}
                  className='w-full sm:flex-1 border-gray-700 hover:bg-gray-800'
                >
                  <XIcon className='mr-2 h-4 w-4' /> 不参加
                </Button>
              </div>
            </>
          )}
        </div>

        <DialogFooter className='sm:mt-6'>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full sm:w-auto border-gray-700 hover:bg-gray-800'
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
