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
import { HotelPublicPaginationDto } from './dto';

@Controller('hotels')
export class HotelsPublicController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Get()
  findAll(@Query() dto: HotelPublicPaginationDto) {
    return this.catalogClient.send('catalog.hotel.findAllPublic', dto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.catalogClient.send('catalog.hotel.findOnePublic', { id });
  }
}
