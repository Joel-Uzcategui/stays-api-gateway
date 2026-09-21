import { Module } from '@nestjs/common';

import { RoomTypesAdminController } from './room-types.admin.controller';
import { RoomTypesGlobalController } from './room-types.global.controller';
import { RoomTypesPublicController } from './room-types.public.controller';
import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../transports/rabbitmq.module';

@Module({
  imports: [RabbitMQModule, AuthModule],
  controllers: [
    RoomTypesGlobalController,
    RoomTypesAdminController,
    RoomTypesPublicController,
  ],
})
export class RoomTypesModule {}
