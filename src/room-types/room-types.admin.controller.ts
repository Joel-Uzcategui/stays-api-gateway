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
import {
  CreateRoomTypeDto,
  RoomTypeGlobalPaginationDto,
  RoomTypePaginationDto,
  UpdateRoomTypeDto,
} from './dto';

@Controller('admin/hotels/:hotelId/room-types')
@UseGuards(AuthGuard, RolesGuard)
@AdminOnly()
export class RoomTypesAdminController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Post()
  create(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Body() dto: CreateRoomTypeDto,
  ) {
    return this.catalogClient.send('catalog.roomType.create', {
      hotelId,
      ...dto,
    });
  }

  @Get()
  findAll(
    @Param('hotelId', new ParseUUIDPipe({ version: '4' })) hotelId: string,
    @Query() dto: RoomTypePaginationDto,
  ) {
    return this.catalogClient.send('catalog.roomType.findAll', {
      hotelId,
      ...dto,
    });
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.catalogClient.send('catalog.roomType.findOne', { id });
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateRoomTypeDto,
  ) {
    return this.catalogClient.send('catalog.roomType.update', { id, ...dto });
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.catalogClient.send('catalog.roomType.remove', { id });
  }
}
