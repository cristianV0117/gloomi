import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { HERO_SOURCES } from '../schemas/home-page-settings.schema';

export class UpdateHomeSettingsDto {
  @IsOptional()
  @IsIn([...HERO_SOURCES])
  heroSource?: 'custom' | 'product';

  @IsOptional()
  @IsString()
  @MaxLength(80)
  heroProductSlug?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  featuredSlugs?: string[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  clearCustomHero?: boolean;
}
