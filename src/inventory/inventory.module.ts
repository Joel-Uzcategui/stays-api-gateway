import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../transports/rabbitmq.module';
import { AvailabilityController } from './availability.controller';
import { InventoryAdminController } from './inventory.admin.controller';

@Module({
  imports: [RabbitMQModule, AuthModule],
  controllers: [InventoryAdminController, AvailabilityController],
})
export class InventoryModule {}
