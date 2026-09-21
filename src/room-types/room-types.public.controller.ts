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
import { RoomTypePublicPaginationDto } from './dto';

@Controller('hotels/:hotelId/room-types')
export class RoomTypesPublicController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Get()
  findAll(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Query() dto: RoomTypePublicPaginationDto,
  ) {
    return this.catalogClient.send('catalog.roomType.findAllPublic', {
      hotelId,
      ...dto,
    });
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.catalogClient.send('catalog.roomType.findOnePublic', { id });
  }
}
