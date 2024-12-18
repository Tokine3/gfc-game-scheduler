import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllUserDto {
  @ApiProperty({
    description: 'ユーザー名',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '取得件数',
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  take?: number;

  @ApiProperty({
    description: '取得開始位置',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  skip?: number;
}
