import { FC, memo } from 'react';
import dayjs from 'dayjs';
import { Checkbox } from '../../../../../../components/ui/checkbox';
import { Input } from '../../../../../../components/ui/input';
import { Switch } from '../../../../../../components/ui/switch';
import { Label } from '../../../../../../components/ui/label';
import { cn } from '../../../../../../../lib/utils';
import { formatDate } from '../../../../../../../lib/dateUtils';
type Props = {
  day: dayjs.Dayjs;
  schedule: {
    isFree: boolean;
    description: string;
    isPrivate: boolean;
  };
  onScheduleChange: (
    day: dayjs.Dayjs,
    field: 'isFree' | 'description' | 'isPrivate',
    value: boolean | string
  ) => void;
};

export const ScheduleRow = memo<Props>(
  ({ day, schedule, onScheduleChange }) => {
    const { dateText, isSunday, isSaturday, isHoliday } = formatDate(day);

    return (
      <div className='group transition-all duration-200 hover:translate-x-1'>
        {/* PC表示 */}
        <div className='hidden sm:grid sm:grid-cols-[40px_120px_1fr_48px] items-center gap-2 p-3 bg-gray-800/20 hover:bg-gray-800/40 rounded-lg border border-transparent hover:border-purple-500/20 transition-all duration-200'>
          <div className='flex justify-center'>
            <Checkbox
              checked={schedule.isFree}
              onCheckedChange={(checked) =>
                onScheduleChange(day, 'isFree', checked)
              }
              className={cn(
                'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500',
                'data-[state=unchecked]:bg-gray-800',
                'border border-gray-700'
              )}
            />
          </div>
          <div className='text-center'>
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
          </div>
          <Input
            placeholder='予定の内容'
            value={schedule.description}
            onChange={(e) =>
              onScheduleChange(day, 'description', e.target.value)
            }
            className='h-8 text-sm bg-gray-900/50 border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500'
          />
          <div className='flex justify-center'>
            <Switch
              checked={schedule.isPrivate}
              onCheckedChange={(checked) =>
                onScheduleChange(day, 'isPrivate', checked)
              }
              className={cn(
                'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-rose-500 data-[state=checked]:to-pink-500',
                'data-[state=unchecked]:bg-gray-800',
                'border border-gray-700',
                '[&>span]:data-[state=checked]:bg-white',
                '[&>span]:data-[state=unchecked]:bg-gray-400'
              )}
            />
          </div>
        </div>

        {/* モバイル表示 */}
        <div className='sm:hidden flex flex-col gap-2 p-2.5 bg-gray-800/20 hover:bg-gray-800/40 rounded-lg border border-transparent hover:border-purple-500/20 transition-all duration-200'>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-sm font-medium min-w-0 truncate'>
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
            </div>
            <div className='flex items-center gap-2 shrink-0'>
              <div className='flex items-center gap-1'>
                <Checkbox
                  id={`available-mobile-${day.format()}`}
                  checked={schedule.isFree}
                  onCheckedChange={(checked) =>
                    onScheduleChange(day, 'isFree', checked)
                  }
                  className={cn(
                    'h-4 w-4',
                    'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500',
                    'data-[state=unchecked]:bg-gray-800',
                    'border border-gray-700'
                  )}
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
                    onScheduleChange(day, 'isPrivate', checked)
                  }
                  className={cn(
                    'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-rose-500 data-[state=checked]:to-pink-500',
                    'data-[state=unchecked]:bg-gray-800',
                    'border border-gray-700',
                    '[&>span]:data-[state=checked]:bg-white',
                    '[&>span]:data-[state=unchecked]:bg-gray-400'
                  )}
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
              onScheduleChange(day, 'description', e.target.value)
            }
            className='h-8 text-sm bg-gray-900/50 border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500'
          />
        </div>
      </div>
    );
  }
);
