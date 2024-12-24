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
import { CalendarDays, User, Clock, CrosshairIcon } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { toast } from '../../../../components/ui/use-toast';
import { Separator } from '../../../../components/ui/separator';
import type { Props } from './types';
import {
  EventDescriptionCard,
  EventInfoCard,
  EventParticipantsCard,
  ReactionButton,
} from './_components';
import { isPublicSchedule } from '../Calendar/_utils/utils';

export const EventDetail: FC<Props> = ({ event, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const eventIcon = event.isPersonal ? (
    <User className='w-5 h-5' />
  ) : (
    <CrosshairIcon className='w-5 h-5' />
  );

  const iconClassName = cn(
    'p-2 rounded-lg',
    event.isPersonal
      ? 'bg-purple-500/20 text-purple-400'
      : 'bg-cyan-500/20 text-cyan-400'
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-100 flex items-center gap-3'>
            <div className={iconClassName}>{eventIcon}</div>
            {event.title}
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-400'>
            イベントの詳細情報
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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

          {isPublicSchedule(event) && (
            <>
              <Separator className='bg-gray-800' />
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetail;
