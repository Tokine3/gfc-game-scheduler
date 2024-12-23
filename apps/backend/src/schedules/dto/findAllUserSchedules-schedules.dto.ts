import { ApiProperty } from '@nestjs/swagger';

export class FindAllUserSchedulesSchedulesDto {
  @ApiProperty({
    description: '開始日',
    example: '2024-01-01',
  })
  fromDate: Date;

  @ApiProperty({
    description: '終了日',
    example: '2024-01-31',
  })
  toDate: Date;
}
