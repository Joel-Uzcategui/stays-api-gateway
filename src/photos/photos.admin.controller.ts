import {
  BadRequestException,
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';

import { CATALOG_SERVICE } from '../config';
import { AdminOnly } from '../auth/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  MAX_UPLOAD_BYTES,
  PHOTO_CONTENT_TYPE,
  PHOTO_EXTENSION,
  StorageService,
  processPhoto,
} from '../storage';
import { CreatePhotoDto, UpdatePhotoDto } from './dto';

const uuid = () => new ParseUUIDPipe({ version: '4' });

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@AdminOnly()
export class PhotosAdminController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
    private readonly storage: StorageService,
  ) {}

  // Multer buffers in memory and the limit is enforced before the buffer is
  // complete, so an oversized upload is cut off rather than held. Nest maps
  // multer's LIMIT_FILE_SIZE to a 413 on its own.
  //
  // The bytes never reach the broker: they are re-encoded and stored here, and
  // only the resulting key travels to catalog-ms, which owns the Photo row.
  @Post('hotels/:hotelId/photos/upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
    }),
  )
  async uploadForHotel(
    @Param('hotelId', uuid()) hotelId: string,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    if (!photo) {
      throw new BadRequestException('No file was sent under "photo"');
    }

    const processed = await processPhoto(photo.buffer);
    const key = `hotels/${hotelId}/${randomUUID()}.${PHOTO_EXTENSION}`;

    await this.storage.put(key, processed, PHOTO_CONTENT_TYPE);

    return this.catalogClient.send('catalog.photo.createForHotel', {
      hotelId,
      url: key,
    });
  }

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
