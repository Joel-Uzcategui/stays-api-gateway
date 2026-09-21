import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CATALOG_SERVICE } from '../config';
import { AdminOnly } from '../auth/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateHotelDto, HotelPaginationDto, UpdateHotelDto } from './dto';

@Controller('admin/hotels')
@UseGuards(AuthGuard, RolesGuard)
@AdminOnly()
export class HotelsAdminController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() dto: CreateHotelDto) {
    return this.catalogClient.send('catalog.hotel.create', dto);
  }

  @Get()
  findAll(@Query() dto: HotelPaginationDto) {
    return this.catalogClient.send('catalog.hotel.findAll', dto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.catalogClient.send('catalog.hotel.findOne', { id });
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body() dto: UpdateHotelDto) {
    return this.catalogClient.send('catalog.hotel.update', { id, ...dto });
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.catalogClient.send('catalog.hotel.remove', { id });
  }
}
