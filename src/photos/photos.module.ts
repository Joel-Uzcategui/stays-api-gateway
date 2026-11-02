import { Module } from '@nestjs/common';

import { PhotosAdminController } from './photos.admin.controller';
import { PhotosPublicController } from './photos.public.controller';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage';
import { RabbitMQModule } from '../transports/rabbitmq.module';

@Module({
  imports: [RabbitMQModule, AuthModule, StorageModule],
  controllers: [PhotosAdminController, PhotosPublicController],
})
export class PhotosModule {}
