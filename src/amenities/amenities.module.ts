import { Module } from '@nestjs/common';

import { AmenitiesAdminController } from './amenities.admin.controller';
import { AmenitiesPublicController } from './amenities.public.controller';
import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../transports/rabbitmq.module';

@Module({
  imports: [RabbitMQModule, AuthModule],
  controllers: [AmenitiesAdminController, AmenitiesPublicController],
})
export class AmenitiesModule {}
