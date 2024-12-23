import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePublicScheduleDto {
  @ApiProperty({ description: '日付' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'タイトル' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: '説明' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '募集人数' })
  @IsNumber()
  @IsOptional()
  quota?: number;
}
