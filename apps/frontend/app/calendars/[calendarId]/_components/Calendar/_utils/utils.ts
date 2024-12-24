import { CalendarEvent } from '../_types/types';
import { PublicScheduleWithRelations } from '../../../../../../apis/@types';

export function isPublicSchedule(
  event: CalendarEvent
): event is PublicScheduleWithRelations {
  return !event.isPersonal;
}
