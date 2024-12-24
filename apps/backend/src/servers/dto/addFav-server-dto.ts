import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class AddFavServerDto {
  @ApiProperty({
    description: 'お気に入りフラグ',
  })
  @IsNotEmpty()
  @IsBoolean()
  isFavorite: boolean;
}
