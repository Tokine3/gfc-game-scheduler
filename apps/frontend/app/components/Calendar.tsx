'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusIcon, Crosshair, Users, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import EventCreation from './EventCreation';
import PersonalEventCreation from './PersonalEventCreation';
import EventDetail from './EventDetail';
import dayjs from 'dayjs';
import CalendarView from './CalendarView';

// // CalendarViewをダイナミックインポート
// const CalendarView = dynamic(
//   () => import('./CalendarView').then((mod) => mod.default),
//   {
//     ssr: false,
//     loading: () => (
//       <div className='h-[400px] flex items-center justify-center bg-[#0B1120]'>
//         <div className='flex flex-col items-center gap-2'>
//           <div className='animate-spin rounded-full h-8 w-8 border-2 border-gray-400 border-t-transparent' />
//           <span className='text-sm text-gray-400'>読み込み中...</span>
//         </div>
//       </div>
//     ),
//   }
// );

export interface Event {
  id: number;
  title: string;
  date: Date;
  participants?: number;
  quota?: number;
  isPersonal: boolean;
}

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [showPersonalEventCreation, setShowPersonalEventCreation] =
    useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const baseDate = dayjs().startOf('day');

    setEvents([
      {
        id: 1,
        title: 'チームデスマッチ',
        date: baseDate.toDate(),
        participants: 5,
        quota: 5,
        isPersonal: false,
      },
      {
        id: 2,
        title: 'コンペティティブ',
        date: baseDate.add(1, 'day').toDate(),
        participants: 2,
        quota: 10,
        isPersonal: false,
      },
      {
        id: 3,
        title: '個人練習',
        date: baseDate.add(2, 'day').toDate(),
        isPersonal: true,
      },
    ]);
    setDate(baseDate.toDate());
  }, []);

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setShowEventCreation(true);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  return (
    <div className='space-y-6 py-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500'>
          <CalendarIcon className='inline-block mr-2 h-8 w-8' />
          ゲームスケジュール
        </h2>
        <div>
          <Button
            onClick={() => setShowEventCreation(true)}
            className='bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 mr-2'
          >
            <Crosshair className='mr-2 h-4 w-4' /> イベント作成
          </Button>
          <Button
            onClick={() => setShowPersonalEventCreation(true)}
            className='bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
          >
            <User className='mr-2 h-4 w-4' /> 個人予定作成
          </Button>
        </div>
      </div>
      <div className='grid gap-6 md:grid-cols-2'>
        <div className='bg-[#0B1120] rounded-lg border border-gray-800/50'>
          <div className='flex items-center justify-center border-b border-gray-800/50 p-4'>
            <h3 className='text-xl font-semibold text-gray-100 flex items-center'>
              <CalendarIcon className='mr-2 h-6 w-6' />
              カレンダー
            </h3>
          </div>
          <div className='p-4'>
            <CalendarView
              date={date}
              events={events}
              onDateSelect={handleDateClick}
            />
          </div>
        </div>
        <div className='bg-[#0B1120] rounded-lg border border-gray-800/50'>
          <div className='flex items-center border-b border-gray-800/50 p-4'>
            <h3 className='text-xl font-semibold text-gray-100 flex items-center'>
              <Crosshair className='mr-2 h-6 w-6' />
              今後のイベント
            </h3>
          </div>
          <div className='p-4 space-y-4'>
            {events.map((event) => (
              <Button
                key={event.id}
                variant='outline'
                className={`w-full justify-start text-left border-gray-700 hover:bg-gray-800 ${
                  event.isPersonal
                    ? 'bg-purple-900'
                    : event.participants === event.quota
                      ? 'bg-green-900'
                      : event.date < new Date()
                        ? 'bg-red-900'
                        : ''
                }`}
                onClick={() => handleEventClick(event)}
              >
                {event.isPersonal ? (
                  <User className='mr-2 h-4 w-4 text-purple-400' />
                ) : (
                  <Crosshair className='mr-2 h-4 w-4 text-cyan-400' />
                )}
                <div>
                  <div className='font-medium text-gray-100'>{event.title}</div>
                  <div className='text-sm text-gray-400'>
                    {dayjs(event.date).format('YYYY年MM月DD日')}
                    {!event.isPersonal && (
                      <>
                        - <Users className='inline h-3 w-3' />{' '}
                        {event.participants}/{event.quota}
                      </>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
      {showEventCreation && (
        <EventCreation
          onClose={() => setShowEventCreation(false)}
          date={date}
        />
      )}
      {showPersonalEventCreation && (
        <PersonalEventCreation
          onClose={() => setShowPersonalEventCreation(false)}
          date={date}
        />
      )}
      {showEventDetail && selectedEvent && (
        <EventDetail
          event={selectedEvent as Event}
          onClose={() => setShowEventDetail(false)}
        />
      )}
    </div>
  );
}
