import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  ParseUUIDPipe,
  StreamableFile,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CATALOG_SERVICE } from '../config';
import { StorageService } from '../storage';

const uuid = () => new ParseUUIDPipe({ version: '4' });

interface PhotoView {
  id: string;
  url: string;
}

@Controller()
export class PhotosPublicController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
    private readonly storage: StorageService,
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

  // The bytes. The bucket is only reachable over the private network, so this
  // streams them rather than handing out a storage URL.
  //
  // These are public marketing photos and the key never changes once written,
  // so the cache can be long and shared — the opposite of what a private
  // document would want.
  @Get('photos/:id/file')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  async file(@Param('id', uuid()) id: string) {
    const photo = await firstValueFrom(
      this.catalogClient.send<PhotoView>('catalog.photo.findOne', { id }),
    );

    const { stream, contentType, contentLength } = await this.storage.get(
      photo.url,
    );

    return new StreamableFile(stream, {
      type: contentType,
      length: contentLength,
    });
  }
}
