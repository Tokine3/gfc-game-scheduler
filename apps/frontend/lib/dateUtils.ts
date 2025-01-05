import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import holidays from '@holiday-jp/holiday_jp';

dayjs.extend(utc);
dayjs.extend(timezone);

// NODE_ENVに基づいてタイムゾーンを設定
const getTimeZone = () => {
  const env = process.env.NODE_ENV as
    | 'development'
    | 'production'
    | 'test'
    | 'local';
  switch (env) {
    case 'development':
    case 'local':
      return 'Asia/Tokyo';
    case 'production':
      return 'UTC';
    default:
      return 'Asia/Tokyo';
  }
};

const APP_TIMEZONE = process.env.NEXT_PUBLIC_APP_TIMEZONE || getTimeZone();

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

export const dateUtils = {
  // APIにリクエストを送る際の日付フォーマット（常にUTC）
  toUTCString: (date: Date | string) => {
    return dayjs(date).utc().format();
  },

  // APIからのレスポンスを適切なタイムゾーンに変換
  fromUTC: (utcDate: string) => {
    return dayjs.utc(utcDate).tz(APP_TIMEZONE);
  },

  // 表示用の日付フォーマット
  formatToDisplay: (date: string, format: string) => {
    return dayjs.utc(date).tz(APP_TIMEZONE).format(format);
  },

  // カレンダー用の日付生成
  toCalendarDate: (date: string) => {
    return dayjs.utc(date).tz(APP_TIMEZONE).toDate();
  },

  // 現在時刻を取得
  now: () => {
    return dayjs().tz(APP_TIMEZONE);
  },

  // 日付の開始時刻を取得
  startOf: (date: Date | string, unit: 'day' | 'month' | 'week') => {
    return dayjs(date).tz(APP_TIMEZONE).startOf(unit);
  },

  // 日付の終了時刻を取得
  endOf: (date: Date | string, unit: 'day' | 'month' | 'week') => {
    return dayjs(date).tz(APP_TIMEZONE).endOf(unit);
  },
};
