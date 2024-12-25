import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class FindPublicSchedulesScheduleDto {
  @ApiProperty({ description: '取得開始日', required: false })
  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @ApiProperty({ description: '取得終了日', required: false })
  @IsOptional()
  @IsDate()
  toDate?: Date;
}
