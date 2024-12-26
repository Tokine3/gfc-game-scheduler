import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';
import { ServerWithRelations } from '../entities/server.entity';
import { Type } from 'class-transformer';

export class AddFavServerDto {
  @ApiProperty({
    description: 'お気に入りフラグ',
  })
  @IsNotEmpty()
  @IsBoolean()
  isFavorite: boolean;

  @ApiProperty({
    description: 'サーバーのメンバーかどうか',
    type: [ServerWithRelations],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServerWithRelations)
  serversList: ServerWithRelations[];
}
