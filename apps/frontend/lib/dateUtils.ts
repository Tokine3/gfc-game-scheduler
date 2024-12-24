import dayjs from 'dayjs';
import holidays from '@holiday-jp/holiday_jp';

const weekdayMap: { [key: string]: string } = {
  Sun: '日',
  Mon: '月',
  Tue: '火',
  Wed: '水',
  Thu: '木',
  Fri: '金',
  Sat: '土',
};

export const getDaysInRange = (
  currentDate: dayjs.Dayjs,
  viewMode: 'month' | 'week'
) => {
  if (viewMode === 'month') {
    const startOfMonth = currentDate.startOf('month');
    const daysInMonth = currentDate.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) =>
      startOfMonth.add(i, 'day')
    );
  }

  const startOfWeek = currentDate.startOf('week');
  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
};

export const formatDate = (date: dayjs.Dayjs) => {
  const weekday = weekdayMap[date.format('ddd')];
  const isHoliday = holidays.between(date.toDate(), date.toDate())[0];
  const isSunday = date.day() === 0;
  const isSaturday = date.day() === 6;

  return {
    dateText: `${date.format('DD')}日(${weekday}${isHoliday ? '/祝' : ''})`,
    isSunday,
    isSaturday,
    isHoliday,
  };
};
