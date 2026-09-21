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
  AmenityPaginationDto,
  CreateAmenityDto,
  UpdateAmenityDto,
} from './dto';

const uuid = () => new ParseUUIDPipe({ version: '4' });

@Controller('admin/amenities')
@UseGuards(AuthGuard, RolesGuard)
@AdminOnly()
export class AmenitiesAdminController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() dto: CreateAmenityDto) {
    return this.catalogClient.send('catalog.amenity.create', dto);
  }

  @Get()
  findAll(@Query() dto: AmenityPaginationDto) {
    return this.catalogClient.send('catalog.amenity.findAll', dto);
  }

  @Get(':id')
  findOne(@Param('id', uuid()) id: string) {
    return this.catalogClient.send('catalog.amenity.findOne', { id });
  }

  @Patch(':id')
  update(@Param('id', uuid()) id: string, @Body() dto: UpdateAmenityDto) {
    return this.catalogClient.send('catalog.amenity.update', { id, ...dto });
  }

  @Delete(':id')
  remove(@Param('id', uuid()) id: string) {
    return this.catalogClient.send('catalog.amenity.remove', { id });
  }
}
