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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CATALOG_SERVICE } from '../config';
import { AdminOnly } from '../auth/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePhotoDto, UpdatePhotoDto } from './dto';

const uuid = () => new ParseUUIDPipe({ version: '4' });

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@AdminOnly()
export class PhotosAdminController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Post('hotels/:hotelId/photos')
  createForHotel(
    @Param('hotelId', uuid()) hotelId: string,
    @Body() dto: CreatePhotoDto,
  ) {
    return this.catalogClient.send('catalog.photo.createForHotel', {
      hotelId,
      ...dto,
    });
  }

  @Get('hotels/:hotelId/photos')
  findForHotel(@Param('hotelId', uuid()) hotelId: string) {
    return this.catalogClient.send('catalog.photo.findForHotel', { hotelId });
  }

  @Post('hotels/:hotelId/room-types/:roomTypeId/photos')
  createForRoomType(
    @Param('roomTypeId', uuid()) roomTypeId: string,
    @Body() dto: CreatePhotoDto,
  ) {
    return this.catalogClient.send('catalog.photo.createForRoomType', {
      roomTypeId,
      ...dto,
    });
  }

  @Get('hotels/:hotelId/room-types/:roomTypeId/photos')
  findForRoomType(@Param('roomTypeId', uuid()) roomTypeId: string) {
    return this.catalogClient.send('catalog.photo.findForRoomType', {
      roomTypeId,
    });
  }

  @Patch('photos/:id')
  update(@Param('id', uuid()) id: string, @Body() dto: UpdatePhotoDto) {
    return this.catalogClient.send('catalog.photo.update', { id, ...dto });
  }

  @Delete('photos/:id')
  remove(@Param('id', uuid()) id: string) {
    return this.catalogClient.send('catalog.photo.remove', { id });
  }
}
