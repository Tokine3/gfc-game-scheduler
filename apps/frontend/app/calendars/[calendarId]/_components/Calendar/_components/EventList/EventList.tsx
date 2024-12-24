import { FC, memo } from 'react';
import { CrosshairIcon, UserIcon, UsersIcon } from 'lucide-react';
import { Button } from '../../../../../../components/ui/button';
import { cn } from '../../../../../../../lib/utils';
import dayjs from 'dayjs';
import { CalendarEvent } from '../../_types/types';
import { isPublicSchedule } from '../../_utils/utils';

type Props = {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  type: 'upcoming' | 'past';
};

export const EventList: FC<Props> = memo(({ events, onEventClick, type }) => {
  const filteredEvents = events
    .filter((event) => {
      const isPast = new Date(event.date) < new Date();
      return type === 'past' ? isPast : !isPast;
    })
    .sort((a, b) => {
      const diff = dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
      return type === 'past' ? -diff : diff;
    });

  if (filteredEvents.length === 0) {
    return (
      <div className='text-sm text-gray-500 text-center py-4'>
        {type === 'past' ? '過去の' : '予定されている'}イベントはありません
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {filteredEvents.map((event) => {
        const joinCount = isPublicSchedule(event)
          ? event.participants?.filter(
              (p: { reaction: string }) => p.reaction === 'OK'
            ).length
          : 0;
        const isFull = isPublicSchedule(event) && joinCount >= event.quota;
        const eventKey = `${type}-${event.isPersonal ? 'personal' : 'public'}-${event.id}`;

        return (
          <Button
            key={eventKey}
            variant='outline'
            className={cn(
              'w-full justify-start text-left border-gray-700/50 hover:bg-gray-800/60 group relative overflow-hidden',
              event.isPersonal
                ? 'bg-purple-500/10'
                : isFull
                  ? 'bg-green-500/10'
                  : 'bg-cyan-500/10',
              type === 'past' && 'opacity-75'
            )}
            onClick={() => onEventClick(event)}
          >
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity' />
            <div className='relative flex items-center w-full gap-3'>
              <div
                className={cn(
                  'p-2 rounded-lg',
                  event.isPersonal
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-cyan-500/20 text-cyan-400',
                  type === 'past' && '/75'
                )}
              >
                {event.isPersonal ? (
                  <UserIcon className='w-4 h-4' />
                ) : (
                  <CrosshairIcon className='w-4 h-4' />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div
                  className={cn(
                    'font-medium truncate',
                    type === 'past' ? 'text-gray-400' : 'text-gray-200'
                  )}
                >
                  {event.title}
                </div>
                <div className='text-sm text-gray-400 flex items-center gap-2'>
                  <span>{dayjs(event.date).format('YYYY年MM月DD日')}</span>
                  {isPublicSchedule(event) && (
                    <span className='flex items-center gap-1'>
                      <UsersIcon className='w-3 h-3' />
                      {joinCount}/{event.quota}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
});

EventList.displayName = 'EventList';
