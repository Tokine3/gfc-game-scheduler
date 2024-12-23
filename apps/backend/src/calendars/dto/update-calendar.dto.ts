import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCalendarDto } from './create-calendar.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCalendarDto {
  @ApiProperty({
    description: 'カレンダー名',
    example: 'テストカレンダー',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
