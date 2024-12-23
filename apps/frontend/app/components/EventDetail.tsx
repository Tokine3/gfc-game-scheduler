'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import {
  CalendarDays,
  Users,
  User,
  MessageSquare,
  Clock,
  CrosshairIcon,
  CheckCircle,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { client } from '../../lib/api';
import { toast } from './ui/use-toast';
import { CalendarEvent, isPublicSchedule } from './Calendar';
import dayjs from 'dayjs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';

interface EventDetailProps {
  event: CalendarEvent;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReaction = async (reaction: 'OK' | 'NG' | 'PENDING') => {
    if (!isPublicSchedule(event)) return;

    setIsSubmitting(true);
    try {
      // 参加状況更新処理を追加する
      // await client.schedules._scheduleId(event.id).reaction.$post({
      //   body: { reaction },
      // });
      toast({
        title: '参加状況を更新しました',
        description: `イベント「${event.title}」の参加状況を更新しました`,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update reaction:', error);
      toast({
        title: 'エラー',
        description: '参加状況の更新に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-100 flex items-center gap-3'>
            <div
              className={cn(
                'p-2 rounded-lg',
                event.isPersonal
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-cyan-500/20 text-cyan-400'
              )}
            >
              {event.isPersonal ? (
                <User className='w-5 h-5' />
              ) : (
                <CrosshairIcon className='w-5 h-5' />
              )}
            </div>
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* イベント情報 */}
          <div className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50'>
                <CalendarDays className='w-5 h-5 text-purple-400' />
                <div>
                  <div className='text-sm font-medium text-gray-300'>
                    開催日
                  </div>
                  <div className='text-gray-400'>
                    {dayjs(event.date).format('YYYY年MM月DD日')}
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50'>
                <Clock className='w-5 h-5 text-cyan-400' />
                <div>
                  <div className='text-sm font-medium text-gray-300'>時間</div>
                  <div className='text-gray-400'>
                    {dayjs(event.date).format('HH:mm')}
                  </div>
                </div>
              </div>
            </div>

            {isPublicSchedule(event) && (
              <>
                <div className='p-4 rounded-lg bg-gray-800/50 border border-gray-700/50'>
                  <div className='flex items-center gap-2 mb-3'>
                    <MessageSquare className='w-5 h-5 text-indigo-400' />
                    <span className='font-medium text-gray-300'>説明</span>
                  </div>
                  <p className='text-gray-400 whitespace-pre-wrap'>
                    {event.description || '説明はありません'}
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-800/50 border border-gray-700/50'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <Users className='w-5 h-5 text-emerald-400' />
                      <span className='font-medium text-gray-300'>参加者</span>
                    </div>
                    <div className='text-sm text-gray-400'>
                      {
                        event.participants.filter((p) => p.reaction === 'OK')
                          .length
                      }
                      /{event.quota}
                    </div>
                  </div>

                  <div className='space-y-4'>
                    {['OK', 'PENDING', 'NG'].map((status) => {
                      const participants = event.participants.filter(
                        (p) => p.reaction === status
                      );
                      if (participants.length === 0) return null;

                      return (
                        <div key={status} className='space-y-2'>
                          <div className='flex items-center gap-2 text-sm'>
                            {status === 'OK' && (
                              <CheckCircle className='w-4 h-4 text-emerald-400' />
                            )}
                            {status === 'PENDING' && (
                              <HelpCircle className='w-4 h-4 text-amber-400' />
                            )}
                            {status === 'NG' && (
                              <XCircle className='w-4 h-4 text-red-400' />
                            )}
                            <span className='text-gray-400'>
                              {status === 'OK' && '参加'}
                              {status === 'UNDECIDED' && '未回答'}
                              {status === 'NG' && '不参加'}（
                              {participants.length}）
                            </span>
                          </div>
                          <div className='flex flex-wrap gap-2'>
                            {participants.map((participant) => (
                              <div
                                key={participant.userId}
                                className='flex items-center gap-2 p-2 rounded-lg bg-gray-800/50'
                              >
                                <Avatar className='w-6 h-6'>
                                  <AvatarImage
                                    src={undefined}
                                    alt={participant.name}
                                  />
                                  <AvatarFallback>
                                    {participant.name}
                                  </AvatarFallback>
                                </Avatar>
                                <span className='text-sm text-gray-300'>
                                  {participant.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* アクションボタン */}
          {isPublicSchedule(event) && (
            <>
              <Separator className='bg-gray-800' />
              <div className='flex flex-col sm:flex-row gap-2'>
                <Button
                  className='flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white'
                  onClick={() => handleReaction('OK')}
                  disabled={isSubmitting}
                >
                  <CheckCircle className='w-4 h-4 mr-2' />
                  参加する
                </Button>
                <Button
                  variant='outline'
                  className='flex-1 border-amber-500/30 text-amber-200 hover:bg-amber-500/10'
                  onClick={() => handleReaction('PENDING')}
                  disabled={isSubmitting}
                >
                  <HelpCircle className='w-4 h-4 mr-2' />
                  未定
                </Button>
                <Button
                  variant='outline'
                  className='flex-1 border-red-500/30 text-red-200 hover:bg-red-500/10'
                  onClick={() => handleReaction('NG')}
                  disabled={isSubmitting}
                >
                  <XCircle className='w-4 h-4 mr-2' />
                  不参加
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
