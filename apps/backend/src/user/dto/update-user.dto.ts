import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'ユーザ名',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
