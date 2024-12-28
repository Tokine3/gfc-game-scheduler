import {
  PersonalScheduleWithRelations,
  PublicScheduleWithRelations,
} from '../../../../../../apis/@types';

export type CalendarEvent =
  | PersonalScheduleWithRelations
  | PublicScheduleWithRelations;

export const isPublicSchedule = (
  event: CalendarEvent
): event is PublicScheduleWithRelations => {
  return !event.isPersonal;
};

export type Availability = {
  date: string;
  count: number;
  users: Array<{
    id: string;
    name: string;
    avatar: string | null;
    isAvailable: boolean;
    isJoined: boolean;
  }>;
};
