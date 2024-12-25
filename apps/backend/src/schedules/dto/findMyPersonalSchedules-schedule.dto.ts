import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class FindMyPersonalSchedulesScheduleDto {
  @ApiProperty({ description: '取得開始日', required: false, type: Date })
  @IsOptional()
  @IsDate()
  fromDate?: Date;
  @ApiProperty({ description: '取得終了日', required: false, type: Date })
  @IsOptional()
  @IsDate()
  toDate?: Date;
}
