'use client';

import * as React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ScrollArea } from './scroll-area';

export type TimeSelectProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const TimeSelect = React.forwardRef<HTMLDivElement, TimeSelectProps>(
  ({ value, onChange, className }, ref) => {
    const hours = Array.from({ length: 24 }, (_, i) =>
      i.toString().padStart(2, '0')
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, '0')
    );

    const [selectedHour, selectedMinute] = value.split(':');
    const [hourOpen, setHourOpen] = React.useState(false);
    const [minuteOpen, setMinuteOpen] = React.useState(false);

    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)}>
        <Select.Root
          value={selectedHour}
          onValueChange={(hour) => onChange(`${hour}:${selectedMinute}`)}
          open={hourOpen}
          onOpenChange={(open) => {
            setHourOpen(open);
            if (open) setMinuteOpen(false);
          }}
        >
          <Select.Trigger
            aria-label='時'
            className={cn(
              'flex h-10 items-center justify-between gap-1 rounded-md border px-3',
              'bg-gray-800/50 border-gray-700/50 text-gray-100',
              'hover:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-violet-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'w-[80px] text-sm'
            )}
          >
            <Select.Value placeholder='00' />
            <Select.Icon>
              <ChevronDown className='h-4 w-4 opacity-50' />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              position='popper'
              sideOffset={5}
              className={cn(
                'z-[999]',
                'animate-in fade-in-0 zoom-in-95',
                'bg-gray-900 border border-gray-800 rounded-md shadow-xl',
                'relative',
                'w-[80px]'
              )}
            >
              <ScrollArea
                className='h-[200px] w-full'
                type='hover'
                scrollHideDelay={100}
              >
                <Select.Viewport
                  className='p-1'
                  onTouchStart={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                  style={{ touchAction: 'pan-y' }}
                >
                  {hours.map((hour) => (
                    <Select.Item
                      key={hour}
                      value={hour}
                      className={cn(
                        'relative flex h-9 select-none items-center rounded-sm px-3 py-1.5',
                        'text-sm text-gray-300 data-[highlighted]:bg-violet-500/20',
                        'data-[highlighted]:text-violet-200 outline-none cursor-default'
                      )}
                    >
                      <Select.ItemText>{hour}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </ScrollArea>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <span className='text-gray-400 font-medium'>:</span>

        <Select.Root
          value={selectedMinute}
          onValueChange={(minute) => onChange(`${selectedHour}:${minute}`)}
          open={minuteOpen}
          onOpenChange={(open) => {
            setMinuteOpen(open);
            if (open) setHourOpen(false);
          }}
        >
          <Select.Trigger
            aria-label='分'
            className={cn(
              'flex h-10 items-center justify-between gap-1 rounded-md border px-3',
              'bg-gray-800/50 border-gray-700/50 text-gray-100',
              'hover:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-violet-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'w-[80px] text-sm'
            )}
          >
            <Select.Value placeholder='00' />
            <Select.Icon>
              <ChevronDown className='h-4 w-4 opacity-50' />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              position='popper'
              sideOffset={5}
              className={cn(
                'z-[999]',
                'animate-in fade-in-0 zoom-in-95',
                'bg-gray-900 border border-gray-800 rounded-md shadow-xl',
                'relative',
                'w-[80px]'
              )}
            >
              <ScrollArea
                className='h-[200px] w-full'
                type='hover'
                scrollHideDelay={100}
              >
                <Select.Viewport
                  className='p-1'
                  onTouchStart={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                  style={{ touchAction: 'pan-y' }}
                >
                  {minutes.map((minute) => (
                    <Select.Item
                      key={minute}
                      value={minute}
                      className={cn(
                        'relative flex h-9 select-none items-center rounded-sm px-3 py-1.5',
                        'text-sm text-gray-300 data-[highlighted]:bg-violet-500/20',
                        'data-[highlighted]:text-violet-200 outline-none cursor-default'
                      )}
                    >
                      <Select.ItemText>{minute}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </ScrollArea>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  }
);

TimeSelect.displayName = 'TimeSelect';
