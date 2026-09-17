import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { RabbitMQModule } from '../transports/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [AuthController],
})
export class AuthModule {}
