import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  PRODUCT_COLORS,
  PRODUCT_SIZES,
  PRODUCT_STYLES,
} from '../schemas/product.schema';

export class UpdateProductBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  editionNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceUsd?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceCop?: number;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(8000)
  story?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  materials?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  sourceGarment?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  care?: string;

  @IsOptional()
  @IsString()
  @IsIn([...PRODUCT_COLORS])
  color?: string;

  @IsOptional()
  @IsString()
  @IsIn([...PRODUCT_STYLES])
  style?: string;

  @IsOptional()
  @IsString()
  @IsIn([...PRODUCT_SIZES])
  size?: string;
}
