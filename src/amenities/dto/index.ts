import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export const AMENITY_SCOPES = ['hotel', 'room', 'both'] as const;

export type AmenityScope = (typeof AMENITY_SCOPES)[number];

export class CreateAmenityDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  @Matches(/^[a-z0-9_]+$/, {
    message:
      'code must contain only lowercase letters, numbers and underscores',
  })
  code: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsIn(AMENITY_SCOPES)
  scope?: AmenityScope;
}

export class UpdateAmenityDto extends PartialType(CreateAmenityDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class AmenityPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Max(200)
  limit?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @IsOptional()
  @IsIn(AMENITY_SCOPES)
  scope?: AmenityScope;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined ? undefined : value === true || value === 'true',
  )
  @IsBoolean()
  active?: boolean;
}
