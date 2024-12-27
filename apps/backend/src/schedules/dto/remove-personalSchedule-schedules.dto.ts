import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemovePersonalScheduleDto {
  @ApiProperty({ description: 'カレンダーID' })
  @IsNotEmpty()
  @IsString()
  calendarId: string;
}
