import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../transports/rabbitmq.module';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [RabbitMQModule, AuthModule],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
