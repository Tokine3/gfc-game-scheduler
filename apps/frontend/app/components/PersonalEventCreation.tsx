'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Lock,
  CheckIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import holidays from '@holiday-jp/holiday_jp';
import { Label } from './ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { cn } from '../../lib/utils';
import { Segment } from './ui/segment';
import { client } from '../../lib/api';

interface PersonalEventCreationProps {
  onClose: () => void;
  date?: Date;
}

type DaySchedule = {
  date: string;
  isFree: boolean;
  description: string;
  isPrivate: boolean;
};

// 月/週切り替えボタンのカスタムスタイル
const viewModeButtonStyle = (isActive: boolean) =>
  cn(
    'transition-all duration-200',
    isActive
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent'
      : 'hover:bg-gray-800'
  );

export default function PersonalEventCreation({
  onClose,
  date,
}: PersonalEventCreationProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(dayjs(date || new Date()));
  const [schedules, setSchedules] = useState<DaySchedule[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // 表示する日付の範囲を取得
  const getDaysInRange = () => {
    if (viewMode === 'month') {
      const startOfMonth = currentDate.startOf('month');
      const daysInMonth = currentDate.daysInMonth();
      return Array.from({ length: daysInMonth }, (_, i) =>
        startOfMonth.add(i, 'day')
      );
    } else {
      const startOfWeek = currentDate.startOf('week');
      return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
    }
  };

  // 日付のフォーマット
  const formatDate = (date: dayjs.Dayjs) => {
    const weekdayMap: { [key: string]: string } = {
      Sun: '日',
      Mon: '月',
      Tue: '火',
      Wed: '水',
      Thu: '木',
      Fri: '金',
      Sat: '土',
    };
    const weekday = weekdayMap[date.format('ddd')];
    const isHoliday = holidays.between(date.toDate(), date.toDate())[0];
    const isSunday = date.day() === 0;
    const isSaturday = date.day() === 6;

    const dateText = `${date.format('DD')}日(${weekday}${isHoliday ? '/祝' : ''})`;

    return (
      <span
        className={cn(
          isSunday || isHoliday
            ? 'text-red-400'
            : isSaturday
              ? 'text-blue-400'
              : 'text-gray-200'
        )}
      >
        {dateText}
      </span>
    );
  };

  // スケジュールの変更を処理
  const handleScheduleChange = (
    day: dayjs.Dayjs,
    field: 'isFree' | 'description' | 'isPrivate',
    value: boolean | string
  ) => {
    setSchedules((prev) => {
      const existingSchedule = prev.find((s) =>
        dayjs(s.date).isSame(day, 'day')
      );
      const newSchedule: DaySchedule = {
        date: day.format('YYYY-MM-DD'),
        isFree: existingSchedule?.isFree || false,
        description: existingSchedule?.description || '',
        isPrivate: existingSchedule?.isPrivate || false,
        [field]: value,
      };

      if (existingSchedule) {
        return prev.map((s) =>
          dayjs(s.date).isSame(day, 'day') ? newSchedule : s
        );
      }
      return [...prev, newSchedule];
    });
    setHasChanges(true);
  };

  // 月/週の移動処理を追加
  const handleDateChange = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      if (viewMode === 'month') {
        return direction === 'prev'
          ? prev.subtract(1, 'month')
          : prev.add(1, 'month');
      } else {
        return direction === 'prev'
          ? prev.subtract(1, 'week')
          : prev.add(1, 'week');
      }
    });
  };

  // 全ての予定が空きかどうかをチェックする関数
  const isAllSchedulesAvailable = () => {
    const days = getDaysInRange();
    return days.every(
      (day) => schedules.find((s) => dayjs(s.date).isSame(day, 'day'))?.isFree
    );
  };

  // 一括チェック機能を更新
  const handleBulkCheck = (e: React.MouseEvent) => {
    e.preventDefault();
    const days = getDaysInRange();
    const allChecked = isAllSchedulesAvailable();

    const newSchedules: DaySchedule[] = days.map((day) => ({
      date: day.format('YYYY-MM-DD'),
      isFree: !allChecked,
      description:
        schedules.find((s) => dayjs(s.date).isSame(day, 'day'))?.description ||
        '',
      isPrivate:
        schedules.find((s) => dayjs(s.date).isSame(day, 'day'))?.isPrivate ||
        false,
    }));
    setSchedules(newSchedules);
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 空き予定がある日のみを抽出してAPIリクエストを作成
      const schedulesToSubmit = schedules.map((schedule) => ({
        date: dayjs(schedule.date).format('YYYY-MM-DD'),
        title: schedule.description || '予定あり',
        description: schedule.description,
        isPrivate: schedule.isPrivate,
        isFree: schedule.isFree, // 空き予定として登録
      }));

      if (schedulesToSubmit.length > 0) {
        console.log('Submitting schedules:', schedulesToSubmit); // デバッグ用
        await client.schedules.personal.post({
          body: schedulesToSubmit,
        });
        onClose();
      } else {
        console.log('No schedules to submit'); // デバッグ用
      }
    } catch (error) {
      console.error('Failed to create personal events:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[85vh] sm:max-h-[85vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-center gap-2'>
            <CalendarIcon className='h-6 w-6' />
            個人予定登録
          </DialogTitle>
          <DialogDescription className='text-center'>
            空き予定登録や予定管理ができます
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 flex-1 min-h-0 overflow-hidden flex flex-col'>
          {/* コントロール部分を更新 */}
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <div className='flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start'>
              <Segment
                value={viewMode}
                onChange={(value) => setViewMode(value as 'month' | 'week')}
                options={[
                  { value: 'month', label: '月' },
                  { value: 'week', label: '週' },
                ]}
              />
              <Button
                variant='outline'
                size='sm'
                onClick={handleBulkCheck}
                className={cn(
                  'text-xs sm:text-sm whitespace-nowrap',
                  isAllSchedulesAvailable() &&
                    'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent'
                )}
              >
                <CheckIcon className='h-3 w-3 sm:h-4 sm:w-4 mr-1' />
                全ての予定を空きにする
              </Button>
            </div>
            <div className='flex items-center gap-2 justify-center sm:ml-auto'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleDateChange('prev')}
                className='h-7 w-7'
              >
                <ChevronLeftIcon className='h-5 w-5' />
              </Button>
              <span className='min-w-[100px] text-center'>
                {currentDate.format('YYYY年MM月')}
              </span>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleDateChange('next')}
                className='h-7 w-7'
              >
                <ChevronRightIcon className='h-5 w-5' />
              </Button>
            </div>
          </div>

          {/* ヘッダー行 - PCのみ */}
          <div className='hidden sm:grid sm:grid-cols-[40px_120px_1fr_48px] items-center gap-2 p-2 border-b border-gray-800 text-center'>
            <div className='flex justify-center'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className='cursor-help'>空</div>
                  </TooltipTrigger>
                  <TooltipContent className='z-[100]' side='right'>
                    <p>予定が空いている場合はチェック</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>日付</div>
            <div>予定の内容</div>
            <div className='flex justify-start'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Lock className='h-4 w-4 cursor-help' />
                  </TooltipTrigger>
                  <TooltipContent className='z-[100]' side='left'>
                    <p>非公開設定（自分のみ閲覧可能）</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* スケジュールリスト - 高さを調整 */}
          <div
            className='space-y-2 overflow-y-auto flex-1'
            style={{ minHeight: 0 }}
          >
            {getDaysInRange().map((day) => {
              const schedule = schedules.find((s) =>
                dayjs(s.date).isSame(day, 'day')
              ) || {
                isFree: false,
                description: '',
                isPrivate: false,
                date: day.format('YYYY-MM-DD'),
              };

              return (
                <div key={day.format()} className='group'>
                  {/* PC表示 */}
                  <div className='hidden sm:grid sm:grid-cols-[40px_120px_1fr_48px] items-center gap-2 p-2 hover:bg-gray-100/5 rounded-md'>
                    <div className='flex justify-center'>
                      <Checkbox
                        id={`available-${day.format()}`}
                        checked={schedule.isFree}
                        onCheckedChange={(checked) =>
                          handleScheduleChange(day, 'isFree', checked)
                        }
                      />
                    </div>
                    <div className='text-center'>{formatDate(day)}</div>
                    <Input
                      placeholder='予定の内容'
                      value={schedule.description}
                      onChange={(e) =>
                        handleScheduleChange(day, 'description', e.target.value)
                      }
                      className='h-8 text-sm'
                    />
                    <div className='flex justify-center'>
                      <Switch
                        id={`private-${day.format()}`}
                        checked={schedule.isPrivate}
                        onCheckedChange={(checked) =>
                          handleScheduleChange(day, 'isPrivate', checked)
                        }
                      />
                    </div>
                  </div>

                  {/* モバイル表示 */}
                  <div className='sm:hidden flex flex-col gap-2 p-3 hover:bg-gray-100/5 rounded-md'>
                    <div className='flex items-center justify-between'>
                      <div className='text-sm'>{formatDate(day)}</div>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1'>
                          <Checkbox
                            id={`available-mobile-${day.format()}`}
                            checked={schedule.isFree}
                            onCheckedChange={(checked) =>
                              handleScheduleChange(day, 'isFree', checked)
                            }
                          />
                          <Label
                            htmlFor={`available-mobile-${day.format()}`}
                            className='text-xs text-gray-400'
                          >
                            空き
                          </Label>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Switch
                            id={`private-mobile-${day.format()}`}
                            checked={schedule.isPrivate}
                            onCheckedChange={(checked) =>
                              handleScheduleChange(day, 'isPrivate', checked)
                            }
                          />
                          <Label
                            htmlFor={`private-mobile-${day.format()}`}
                            className='text-xs text-gray-400'
                          >
                            非公開
                          </Label>
                        </div>
                      </div>
                    </div>
                    <Input
                      placeholder='予定の内容'
                      value={schedule.description}
                      onChange={(e) =>
                        handleScheduleChange(day, 'description', e.target.value)
                      }
                      className='text-sm'
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className='flex-shrink-0 mt-4 sm:mt-2 pb-safe'>
          <div className='flex w-full flex-col-reverse sm:flex-row sm:justify-end gap-2'>
            <Button
              variant='outline'
              onClick={onClose}
              className='w-full sm:w-auto border-gray-700 hover:bg-gray-800 h-9'
            >
              閉じる
            </Button>
            <Button
              type='submit'
              className='w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 h-9'
            >
              {hasChanges ? '更新' : '登録'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
