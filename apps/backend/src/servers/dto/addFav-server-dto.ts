import { IsBoolean, IsNotEmpty } from 'class-validator';

export class AddFavServerDto {
  @IsNotEmpty()
  @IsBoolean()
  isFavorite: boolean;
}
