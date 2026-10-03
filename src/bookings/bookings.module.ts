import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../transports/rabbitmq.module';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [RabbitMQModule, AuthModule],
  controllers: [BookingsController],
})
export class BookingsModule {}
