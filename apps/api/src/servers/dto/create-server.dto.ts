import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServerDto {
  @ApiProperty({
    description: 'サーバー名',
    example: 'My Server',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'サーバーアイコン',
    example: 'ABCDEF12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon: string | null;

  @ApiProperty({
    description: 'サーバーID',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  serverId: string;
}
