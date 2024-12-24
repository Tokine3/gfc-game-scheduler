import { CalendarEvent } from '../Calendar/_types/types';

export type Participant = {
  userId: string;
  name: string;
  reaction: 'OK' | 'UNDECIDED' | 'NG';
};

export type Props = {
  event: CalendarEvent;
  onClose: () => void;
};
