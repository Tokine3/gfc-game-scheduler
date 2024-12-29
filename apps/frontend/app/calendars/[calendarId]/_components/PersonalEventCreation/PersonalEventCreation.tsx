'use client';

import { FC, useState, useEffect, useCallback, useMemo, memo } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { logger } from '../../../../../lib/logger';
import { client } from '../../../../../lib/api';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  Info,
  Loader2,
  Lock,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Segment } from '../../../../components/ui/segment';
import { Button } from '../../../../components/ui/button';
import { getDaysInRange } from '../../../../../lib/dateUtils';
import { ScheduleRow } from './_components';
import { toast } from '../../../../components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip';

// 型定義
type Props = {
  onClose: () => void;
  date?: Date;
  calendarId: string;
  initialSchedules?: {
    date: string;
    isFree: boolean;
    title: string;
    isPrivate: boolean;
  }[];
  onSuccess?: () => void;
};

type DaySchedule = {
  /** 日付 */
  date: string;
  /** 空き予定かどうか */
  isFree: boolean;
  /** 予定の内容 */
  description: string;
  /** 非公開かどうか */
  isPrivate: boolean;
};

type ViewMode = 'month' | 'week';

// メモ化されたコンポーネント
const MemoizedScheduleRow = memo(ScheduleRow);

export const PersonalEventCreation: FC<Props> = ({
  onClose,
  date,
  calendarId,
  initialSchedules,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(() =>
    dayjs(date || new Date())
      .tz('Asia/Tokyo')
      .startOf('day')
  );
  const [schedules, setSchedules] = useState<DaySchedule[]>(() =>
    (initialSchedules || []).map((schedule) => ({
      date: dayjs(schedule.date).tz('Asia/Tokyo').format('YYYY-MM-DD'),
      isFree: schedule.isFree,
      description: schedule.title || '',
      isPrivate: schedule.isPrivate,
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // 日付範囲の計算をメモ化
  const dateRange = useMemo(
    () => getDaysInRange(currentDate, viewMode),
    [currentDate, viewMode]
  );

  // スケジュール表示部分を最適化
  const getDaySchedule = useCallback(
    (day: dayjs.Dayjs): DaySchedule => {
      const dateStr = day.tz('Asia/Tokyo').format('YYYY-MM-DD');
      return (
        schedules.find((s) => s.date === dateStr) || {
          date: dateStr,
          isFree: false,
          description: '',
          isPrivate: false,
        }
      );
    },
    [schedules]
  );

  // 初期データの取得を最適化
  useEffect(() => {
    const fetchExistingSchedules = async () => {
      if (!calendarId) return;

      try {
        const response = await client.schedules
          ._calendarId(calendarId)
          .me.personal.$get({
            query: {
              fromDate: currentDate
                .startOf(viewMode)
                .subtract(1, 'hour')
                .tz('Asia/Tokyo')
                .format(),
              toDate: currentDate
                .endOf(viewMode)
                .add(1, 'hour')
                .tz('Asia/Tokyo')
                .format(),
            },
          });

        const newSchedules = response.map((schedule) => ({
          date: dayjs(schedule.date).tz('Asia/Tokyo').format('YYYY-MM-DD'),
          isFree: schedule.isFree,
          description: schedule.title || '',
          isPrivate: schedule.isPrivate,
        }));

        setSchedules(newSchedules);
        setHasChanges(false);
      } catch (error) {
        logger.error('Failed to fetch personal schedules:', error);
      }
    };

    if (!initialSchedules || !currentDate.isSame(dayjs(date), 'month')) {
      fetchExistingSchedules();
    }
  }, [calendarId, currentDate, viewMode, initialSchedules, date]);

  // スケジュールの変更を処理
  const handleScheduleChange = useCallback(
    (
      day: dayjs.Dayjs,
      field: 'isFree' | 'description' | 'isPrivate',
      value: boolean | string
    ) => {
      setSchedules((prev) => {
        const dateStr = day.format('YYYY-MM-DD');
        const existingIndex = prev.findIndex((s) => s.date === dateStr);
        const newSchedules = [...prev];

        if (existingIndex >= 0) {
          newSchedules[existingIndex] = {
            ...newSchedules[existingIndex],
            [field]: value,
          };
        } else {
          newSchedules.push({
            date: dateStr,
            isFree: false,
            description: '',
            isPrivate: false,
            [field]: value,
          });
        }

        return newSchedules;
      });
      setHasChanges(true);
    },
    []
  );

  // 月/週の移動処理を最適化
  const handleDateChange = useCallback(
    (direction: 'prev' | 'next') => {
      setCurrentDate((prev) =>
        direction === 'prev'
          ? prev.subtract(1, viewMode).startOf(viewMode)
          : prev.add(1, viewMode).startOf(viewMode)
      );
    },
    [viewMode]
  );

  // 一括チェック機能を最適化
  const handleBulkCheck = useCallback(() => {
    const allChecked = dateRange.every((day) => getDaySchedule(day).isFree);

    setSchedules((prev) => {
      const newSchedules = [...prev];
      dateRange.forEach((day) => {
        const dateStr = day.format('YYYY-MM-DD');
        const existingIndex = newSchedules.findIndex((s) => s.date === dateStr);

        if (existingIndex >= 0) {
          newSchedules[existingIndex] = {
            ...newSchedules[existingIndex],
            isFree: !allChecked,
          };
        } else {
          newSchedules.push({
            date: dateStr,
            isFree: !allChecked,
            description: '',
            isPrivate: false,
          });
        }
      });

      return newSchedules;
    });
    setHasChanges(true);
  }, [dateRange, getDaySchedule]);

  // 送信処理を最適化
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const schedulesToSubmit = schedules.map((schedule) => ({
        date: dayjs.tz(schedule.date, 'Asia/Tokyo').format('YYYY-MM-DD'),
        title: schedule.description,
        description: schedule.description,
        isPrivate: schedule.isPrivate,
        isFree: schedule.isFree,
      }));

      if (schedulesToSubmit.length > 0) {
        await client.schedules._calendarId(calendarId).personal.$post({
          body: schedulesToSubmit,
        });

        // キャッシュの更新を最適化
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['personalSchedules', calendarId],
          }),
          queryClient.invalidateQueries({
            queryKey: ['calendar', calendarId],
          }),
          queryClient.invalidateQueries({
            queryKey: ['schedules', calendarId],
          }),
        ]);

        onSuccess?.();
        onClose();
      }
    } catch (error) {
      logger.error('Failed to create personal events:', error);
      toast({
        title: 'エラー',
        description: '予定の更新に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 sm:max-w-2xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col m-0 sm:m-4 rounded-none sm:rounded-lg border-0 sm:border'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle className='text-lg sm:text-xl font-bold text-gray-100 flex items-center gap-2'>
            <div className='p-1 sm:p-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/20'>
              <CalendarIcon className='w-4 h-4 sm:w-5 sm:h-5 text-violet-400' />
            </div>
            個人予定登録
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-400'>
            空き予定登録や予定管理ができます
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-hidden'>
          <div className='h-full overflow-y-auto px-1 -mx-1'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className='space-y-2 sm:space-y-3 py-1 sm:py-2'
            >
              <div className='hidden sm:flex p-3 rounded-lg border border-violet-500/20 bg-violet-500/5 text-sm text-violet-200 items-start gap-2'>
                <Info className='w-4 h-4 mt-0.5 text-violet-400' />
                <div>
                  個人の予定を登録・管理きます。
                  <br />
                  空き予定の設定や非公開設定が可能です。
                </div>
              </div>

              {/* コントロールパネル */}
              <div className='p-2 sm:p-3 rounded-lg border border-gray-700/50 bg-gray-800/50'>
                <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4'>
                  <div className='flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start'>
                    <div className='bg-gray-900/50 rounded-lg p-1 backdrop-blur-sm border border-gray-700/50'>
                      <Segment
                        value={viewMode}
                        onChange={(value) =>
                          setViewMode(value as 'month' | 'week')
                        }
                        options={[
                          { value: 'month', label: '月' },
                          { value: 'week', label: '週' },
                        ]}
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleDateChange('prev')}
                        className='h-8 w-8 border-gray-700 hover:bg-gray-800/60 hover:border-purple-500/50 transition-all duration-200'
                      >
                        <ChevronLeftIcon className='h-4 w-4' />
                      </Button>
                      <div className='text-sm font-medium text-gray-200 min-w-[100px] text-center bg-gray-800/40 py-1.5 px-3 rounded-md border border-gray-700/50'>
                        {viewMode === 'month'
                          ? currentDate.format('YYYY年MM月')
                          : `${currentDate.startOf('week').format('MM/DD')} - ${currentDate.endOf('week').format('MM/DD')}`}
                      </div>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleDateChange('next')}
                        className='h-8 w-8 border-gray-700 hover:bg-gray-800/60 hover:border-purple-500/50 transition-all duration-200'
                      >
                        <ChevronRightIcon className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleBulkCheck}
                    className={cn(
                      'text-xs sm:text-sm whitespace-nowrap',
                      dateRange.every((day) => getDaySchedule(day).isFree)
                        ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-transparent'
                        : 'hover:bg-gray-800/60 border-gray-700'
                    )}
                  >
                    <CheckIcon className='h-3 w-3 sm:h-4 sm:w-4 mr-1.5' />
                    全ての予定を空きにする
                  </Button>
                </div>
              </div>

              {/* スケジュールリスト */}
              <div className='rounded-lg border border-gray-700/50 bg-gray-800/50 overflow-hidden'>
                <div className='sticky top-0 z-10 hidden sm:grid sm:grid-cols-[40px_120px_1fr_48px] items-center gap-2 p-2 border-b border-gray-700/50 bg-gray-800/95 backdrop-blur-sm'>
                  <div className='flex justify-end'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className='text-gray-400 cursor-help'>空</div>
                        </TooltipTrigger>
                        <TooltipContent
                          side='right'
                          className='bg-gray-800 border-gray-700'
                        >
                          <p>予定が空いている場合はチェック</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className='text-gray-400 font-medium text-center'>
                    日付
                  </div>
                  <div className='text-gray-400 font-medium text-center'>
                    予定の内容
                  </div>
                  <div className='flex justify-start'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Lock className='h-4 w-4 text-gray-400 cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent
                          side='left'
                          className='bg-gray-800 border-gray-700'
                        >
                          <p>非公開設定（自分のみ閲覧可能）</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className='max-h-[calc(100vh-420px)] sm:max-h-[420px] overflow-y-auto p-2 space-y-1.5'>
                  {dateRange.map((day) => {
                    const schedule = getDaySchedule(day);
                    return (
                      <MemoizedScheduleRow
                        key={day.format()}
                        day={day}
                        schedule={schedule}
                        onScheduleChange={handleScheduleChange}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <DialogFooter className='flex-shrink-0 gap-2 border-t border-gray-800/60 bg-gray-900/95 backdrop-blur-md p-2 sm:p-0 sm:border-0 sm:bg-transparent'>
          <Button
            variant='outline'
            onClick={onClose}
            className='flex-1 sm:flex-none border-gray-700 hover:bg-gray-800'
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='flex-1 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin' />
                更新中...
              </div>
            ) : hasChanges ? (
              '更新する'
            ) : (
              '登録する'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalEventCreation;
