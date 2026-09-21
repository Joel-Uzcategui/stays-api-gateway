import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CATALOG_SERVICE } from '../config';
import { AmenityPaginationDto } from './dto';

const uuid = () => new ParseUUIDPipe({ version: '4' });

@Controller()
export class AmenitiesPublicController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Get('amenities')
  findAll(@Query() dto: AmenityPaginationDto) {
    return this.catalogClient.send('catalog.amenity.findAll', dto);
  }

  @Get('hotels/:hotelId/amenities')
  findForHotel(@Param('hotelId', uuid()) hotelId: string) {
    return this.catalogClient.send('catalog.amenity.findForHotel', { hotelId });
  }

  @Get('hotels/:hotelId/room-types/:roomTypeId/amenities')
  findForRoomType(@Param('roomTypeId', uuid()) roomTypeId: string) {
    return this.catalogClient.send('catalog.amenity.findForRoomType', {
      roomTypeId,
    });
  }
}
