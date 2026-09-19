import { Module } from '@nestjs/common';

import { HotelsAdminController } from './hotels.admin.controller';
import { HotelsPublicController } from './hotels.public.controller';
import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../transports/rabbitmq.module';

@Module({
  imports: [RabbitMQModule, AuthModule],
  controllers: [HotelsAdminController, HotelsPublicController],
})
export class HotelsModule {}
