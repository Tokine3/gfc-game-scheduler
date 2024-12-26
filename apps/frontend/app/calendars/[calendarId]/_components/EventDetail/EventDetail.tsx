'use client';

import { FC, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../../components/ui/dialog';
import {
  CalendarDays,
  Clock,
  CrosshairIcon,
  Edit3,
  UserCircle2,
  Calendar,
} from 'lucide-react';
import { toast } from '../../../../components/ui/use-toast';
import type { Props } from './types';
import {
  EventDescriptionCard,
  EventInfoCard,
  EventParticipantsCard,
  ReactionButton,
} from './_components';
import { isPublicSchedule } from '../Calendar/_utils/utils';
import { Button } from '../../../../components/ui/button';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '../../../../components/ui/avatar';

export const EventDetail: FC<Props> = ({ event, onClose, onEdit }) => {
  const { currentUser } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOwner = event.serverUser?.userId === currentUser?.id;
  const now = dayjs();
  const isPast = dayjs(event.date).isBefore(now);

  const handleReaction = useCallback(
    async (reaction: 'OK' | 'NG' | 'PENDING') => {
      if (!isPublicSchedule(event)) return;

      setIsSubmitting(true);
      try {
        // TODO: 参加状況更新処理を追加する
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
    },
    [event, onClose]
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 sm:max-w-xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col m-0 sm:m-4 rounded-none sm:rounded-lg border-0 sm:border'>
        <DialogHeader className='flex-shrink-0 p-1 sm:p-2'>
          <DialogTitle className='text-lg sm:text-xl font-bold text-gray-100 flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/20'>
              <CrosshairIcon className='w-5 h-5 text-blue-400' />
            </div>
            {event.title}
          </DialogTitle>
          <div className='flex items-center justify-between mt-1'>
            <DialogDescription className='text-sm text-gray-400'>
              イベントの詳細情報
            </DialogDescription>
            {isOwner && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onEdit}
                className='h-7 px-2.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20'
              >
                <Edit3 className='w-4 h-4 mr-1.5' />
                編集する
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto px-3 sm:px-4'>
          <div className='space-y-4 py-3'>
            <div className='space-y-3'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <EventInfoCard
                  icon={CalendarDays}
                  label='開催日'
                  value={dayjs(event.date).format('YYYY年MM月DD日')}
                  iconColor='text-purple-400'
                />
                <EventInfoCard
                  icon={Clock}
                  label='時間'
                  value={dayjs(event.date).format('HH:mm')}
                  iconColor='text-cyan-400'
                />
              </div>

              {isPublicSchedule(event) && (
                <>
                  <EventDescriptionCard description={event.description} />
                  <EventParticipantsCard
                    participants={event.participants}
                    quota={event.quota}
                  />
                </>
              )}
            </div>

            <div className='p-3 rounded-lg bg-gray-800/50 border border-gray-700/50'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-400 w-14'>作成者</span>
                  <div className='flex items-center gap-2 min-w-0'>
                    <Avatar className='h-6 w-6 border border-gray-700/50'>
                      {event.serverUser?.user.avatar ? (
                        <AvatarImage
                          src={`https://cdn.discordapp.com/avatars/${event.serverUser?.user.id}/${event.serverUser?.user.avatar}`}
                          alt={event.serverUser?.user.name}
                        />
                      ) : (
                        <AvatarFallback>
                          <UserCircle2 className='w-3 h-3 text-gray-400' />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className='text-base text-gray-200 truncate'>
                      {event.serverUser?.user.name}
                    </span>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-gray-400 w-14'>作成日</span>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-gray-400 flex-shrink-0' />
                      <time className='text-sm text-gray-200 whitespace-nowrap'>
                        {dayjs(event.createdAt).format('YYYY年MM月DD日')}
                      </time>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-gray-400 w-14'>更新日</span>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-gray-400 flex-shrink-0' />
                      <time className='text-sm text-gray-200 whitespace-nowrap'>
                        {dayjs(event.updatedAt).format('YYYY年MM月DD日')}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPublicSchedule(event) && (
          <div className='flex-shrink-0 border-t border-gray-800/60 bg-gray-900/95 backdrop-blur-md p-3 sm:p-4'>
            <div className='flex flex-col sm:flex-row gap-2'>
              <ReactionButton
                type='OK'
                onClick={() => handleReaction('OK')}
                disabled={isSubmitting}
              />
              <ReactionButton
                type='PENDING'
                onClick={() => handleReaction('PENDING')}
                disabled={isSubmitting}
              />
              <ReactionButton
                type='NG'
                onClick={() => handleReaction('NG')}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDetail;
