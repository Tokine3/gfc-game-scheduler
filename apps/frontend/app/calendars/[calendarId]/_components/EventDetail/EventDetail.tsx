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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import {
  CalendarDays,
  Clock,
  CrosshairIcon,
  Edit3,
  UserCircle2,
  Calendar,
  Trash2,
  Loader2,
} from 'lucide-react';
import { toast } from '../../../../components/ui/use-toast';
import type { Props } from './types';
import { logger } from '../../../../../lib/logger';
import { isPublicSchedule } from '../Calendar/_utils/utils';
import { Button } from '../../../../components/ui/button';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '../../../../components/ui/avatar';
import {
  EventDescriptionCard,
  EventInfoCard,
  EventParticipantsCard,
  ReactionButton,
} from './_components';
import { cn } from '../../../../../lib/utils';

export const EventDetail: FC<Props> = ({
  calendarId,
  event,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { currentUser } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      console.log('削除開始');
      await onDelete?.();
      console.log('削除API完了');

      // 成功時のみ状態を更新（順序を変更）
      onClose(); // 先にイベント詳細モーダルを閉じる
      setShowDeleteDialog(false); // 次に削除ダイアログを閉じる

      // 最後にトースト表示
      toast({
        title: '予定を削除しました',
        description: `${event.title || '無題の予定'}を削除しました`,
      });
    } catch (error) {
      console.error('削除エラー:', error);
      toast({
        title: '削除に失敗しました',
        description: 'もう一度お試しください',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dialog の onOpenChange を修正
  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      console.log('handleDialogOpenChange', {
        open,
        showDeleteDialog,
        isSubmitting,
      });

      // 削除ダイアログが開いていない場合のみ閉じる操作を許可
      if (!open && !showDeleteDialog && !isSubmitting) {
        onClose();
      }
    },
    [showDeleteDialog, isSubmitting, onClose]
  );

  return (
    <>
      <Dialog open={true} onOpenChange={handleDialogOpenChange}>
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
                <div className='flex items-center gap-2'>
                  {isPublicSchedule(event) && !event.isDeleted && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={onEdit}
                      className='h-7 px-2.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20'
                    >
                      <Edit3 className='w-4 h-4 mr-1.5' />
                      編集
                    </Button>
                  )}
                  <Button
                    variant='ghost'
                    size='sm'
                    disabled={isPublicSchedule(event) && event.isDeleted}
                    onClick={() => setShowDeleteDialog(true)}
                    className={cn(
                      isPublicSchedule(event) && event.isDeleted
                        ? 'h-7 px-2.5 rounded-lg bg-gradient-to-r from-gray-400/20 to-gray-400/20 text-gray-100 border border-gray-400/20 opacity-50 cursor-not-allowed'
                        : 'h-7 px-2.5 rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 text-red-400 hover:text-red-300 border border-red-500/20'
                    )}
                  >
                    {isPublicSchedule(event) && event.isDeleted ? (
                      <div className='flex items-center gap-2'>
                        <Trash2 className='w-4 h-4 mr-1.5' />
                        削除済み
                      </div>
                    ) : isSubmitting ? (
                      <div className='flex items-center gap-2'>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        削除中...
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <Trash2 className='w-4 h-4 mr-1.5' />
                        削除
                      </div>
                    )}
                  </Button>
                </div>
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
                  disabled={isSubmitting || event.isDeleted}
                />
                <ReactionButton
                  type='PENDING'
                  onClick={() => handleReaction('PENDING')}
                  disabled={isSubmitting || event.isDeleted}
                />
                <ReactionButton
                  type='NG'
                  onClick={() => handleReaction('NG')}
                  disabled={isSubmitting || event.isDeleted}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setShowDeleteDialog(false);
          }
        }}
      >
        <AlertDialogContent className='bg-gray-900 border-gray-800'>
          <AlertDialogHeader>
            <AlertDialogTitle>予定を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className='space-y-2'>
                <div>
                  「{event.title || '無題の予定'}
                  」を削除します。この操作は元に戻せません。
                </div>
                {isPublicSchedule(event) && (
                  <div className='text-yellow-400'>
                    ※ 削除されたイベントは、参加者の予定一覧には表示が残ります
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className='border-gray-700 hover:bg-gray-800'
              disabled={isSubmitting}
            >
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-500 hover:bg-red-600 text-white'
              disabled={isSubmitting}
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventDetail;
