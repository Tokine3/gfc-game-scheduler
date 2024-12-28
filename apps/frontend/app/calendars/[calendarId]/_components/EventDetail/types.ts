import { CalendarEvent } from '../Calendar/_types/types';

export type Participant = {
  userId: string;
  name: string;
  reaction: 'OK' | 'PENDING' | 'NG' | 'NONE';
};

export type Props = {
  calendarId: string;
  event: CalendarEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
};
