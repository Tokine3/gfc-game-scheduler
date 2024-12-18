import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreatePersonalScheduleDto {
  @ApiProperty({ description: '日付' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'タイトル' })
  @IsString()
  title: string;

  @ApiProperty({ description: '説明' })
  @IsString()
  description: string;

  @ApiProperty({ description: '非公開フラグ' })
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty({ description: '無料フラグ' })
  @IsBoolean()
  isFree: boolean;
}
