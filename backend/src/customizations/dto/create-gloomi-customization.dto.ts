import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

const CREATURE = ['bear', 'cat', 'dog', 'mouse', 'rabbit'] as const;
const EYES = [
  'round',
  'slit',
  'star',
  'heart',
  'spiral',
  'gem',
  'button',
] as const;
const HATS = ['none', 'mini', 'tulle', 'beanie', 'horns', 'bow'] as const;
const CHARMS = [
  'moon',
  'web',
  'heart',
  'sparkle',
  'skull',
  'rose',
] as const;
const WINGS = ['none', 'bat'] as const;
const TAILS = ['none', 'devil'] as const;
const PREVIEW = ['three_d', 'vector'] as const;

export class FabricByZoneDto {
  @IsString()
  @MaxLength(100)
  head: string;

  @IsString()
  @MaxLength(100)
  body: string;

  @IsString()
  @MaxLength(100)
  limbs: string;
}

export class CustomizationConfigDto {
  @IsIn([...CREATURE])
  creatureId: string;

  @ValidateNested()
  @Type(() => FabricByZoneDto)
  fabricByZone: FabricByZoneDto;

  @IsIn([...EYES])
  eyeId: string;

  @IsIn([...HATS])
  hatId: string;

  @IsIn([...CHARMS])
  charmId: string;

  @IsIn([...WINGS])
  wingKind: string;

  @IsIn([...TAILS])
  tailAccentKind: string;

  @IsOptional()
  @IsIn([...PREVIEW])
  previewMode?: string;
}

export class CreateGloomiCustomizationDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @ValidateNested()
  @Type(() => CustomizationConfigDto)
  config: CustomizationConfigDto;
}
