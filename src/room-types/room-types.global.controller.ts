import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CATALOG_SERVICE } from '../config';
import { AdminOnly } from '../auth/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoomTypeGlobalPaginationDto } from './dto';

@Controller('admin/room-types')
@UseGuards(AuthGuard, RolesGuard)
@AdminOnly()
export class RoomTypesGlobalController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Get()
  findAll(@Query() dto: RoomTypeGlobalPaginationDto) {
    return this.catalogClient.send('catalog.roomType.findAllGlobal', dto);
  }
}
