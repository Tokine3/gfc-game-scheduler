import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class FindOneCalendarDto {
  @ApiProperty({ required: false, type: Date })
  @IsDate()
  fromDate?: Date;
  @ApiProperty({ required: false, type: Date })
  @IsDate()
  toDate?: Date;
}
