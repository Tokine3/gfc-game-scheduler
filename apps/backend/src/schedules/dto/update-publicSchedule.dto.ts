import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePublicScheduleDto } from './create-publicSchedule.dto';
import { IsString } from 'class-validator';

export class UpdatePublicScheduleDto extends PartialType(
  CreatePublicScheduleDto
) {
  @ApiProperty({ description: 'カレンダーID' })
  @IsString()
  calendarId: string;
}
