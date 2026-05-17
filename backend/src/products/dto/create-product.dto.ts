import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  PRODUCT_COLORS,
  PRODUCT_SIZES,
  PRODUCT_STYLES,
} from '../schemas/product.schema';

/** Campos del formulario (multipart). Imágenes en archivos `images`. */
export class CreateProductBodyDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug debe ser minúsculas, números y guiones (ej: mi-gloomi)',
  })
  slug: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  editionNumber: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceUsd: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceCop: number;

  @IsString()
  @MinLength(10)
  @MaxLength(8000)
  story: string;

  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  materials: string;

  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  sourceGarment: string;

  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  care: string;

  @IsString()
  @IsIn([...PRODUCT_COLORS])
  color: string;

  @IsString()
  @IsIn([...PRODUCT_STYLES])
  style: string;

  @IsString()
  @IsIn([...PRODUCT_SIZES])
  size: string;
}
