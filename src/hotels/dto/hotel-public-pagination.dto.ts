import { OmitType } from '@nestjs/mapped-types';

import { HotelPaginationDto } from './hotel-pagination.dto';

export class HotelPublicPaginationDto extends OmitType(HotelPaginationDto, [
  'active',
] as const) {}
