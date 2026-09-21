import { Module } from '@nestjs/common';

import { PhotosAdminController } from './photos.admin.controller';
import { PhotosPublicController } from './photos.public.controller';
import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../transports/rabbitmq.module';

@Module({
  imports: [RabbitMQModule, AuthModule],
  controllers: [PhotosAdminController, PhotosPublicController],
})
export class PhotosModule {}
