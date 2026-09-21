import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CATALOG_SERVICE } from '../config';

const uuid = () => new ParseUUIDPipe({ version: '4' });

@Controller()
export class PhotosPublicController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Get('hotels/:hotelId/photos')
  findForHotel(@Param('hotelId', uuid()) hotelId: string) {
    return this.catalogClient.send('catalog.photo.findForHotel', { hotelId });
  }

  @Get('hotels/:hotelId/room-types/:roomTypeId/photos')
  findForRoomType(@Param('roomTypeId', uuid()) roomTypeId: string) {
    return this.catalogClient.send('catalog.photo.findForRoomType', {
      roomTypeId,
    });
  }
}
