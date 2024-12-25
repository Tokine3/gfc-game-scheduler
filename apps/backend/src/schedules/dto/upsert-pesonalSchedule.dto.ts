import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpsertPersonalScheduleDto {
  @ApiProperty({ description: '日付' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: 'タイトル' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '説明' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '非公開フラグ' })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @ApiPropertyOptional({ description: '空きフラグ' })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;
}
