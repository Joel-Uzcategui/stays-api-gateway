import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// A storage key, not a URL, and anchored so it cannot walk out of its prefix.
const STORAGE_KEY = /^[A-Za-z0-9][A-Za-z0-9/_.-]*$/;
const NO_TRAVERSAL = /^(?!.*\.\.)/;

export class CreatePhotoDto {
  @IsString()
  @MaxLength(512)
  @Matches(STORAGE_KEY, { message: 'url must be a storage key' })
  @Matches(NO_TRAVERSAL, { message: 'url must not contain ..' })
  url: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1000)
  position?: number;
}

export class UpdatePhotoDto {
  @IsOptional()
  @IsString()
  @MaxLength(512)
  @Matches(STORAGE_KEY, { message: 'url must be a storage key' })
  @Matches(NO_TRAVERSAL, { message: 'url must not contain ..' })
  url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1000)
  position?: number;
}

export class ReorderPhotosDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  ids: string[];
}
