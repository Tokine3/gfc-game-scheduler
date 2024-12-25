import { CalendarEvent } from '../_types/types';
import { PublicScheduleWithRelations } from '../../../../../../apis/@types';

export const isPublicSchedule = (
  event: CalendarEvent
): event is PublicScheduleWithRelations => {
  return !event.isPersonal;
};

export const isVisibleEvent = (event: CalendarEvent) => {
  if (isPublicSchedule(event)) {
    return true;
  }
  return !isPublicSchedule(event) && !!event.title;
};
