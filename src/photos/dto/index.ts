import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePhotoDto {
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2000)
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
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2000)
  url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1000)
  position?: number;
}
