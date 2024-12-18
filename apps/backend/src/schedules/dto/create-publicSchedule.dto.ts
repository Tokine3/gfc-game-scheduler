import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class CreatePublicScheduleDto {
  @ApiProperty({ description: '日付' })
  @IsDate()
  date: Date;
  @ApiProperty({ description: 'タイトル' })
  title: string;
  @ApiProperty({ description: '説明' })
  description: string;
  @ApiProperty({ description: '募集人数' })
  @IsNumber()
  recruitCount: number;
}
