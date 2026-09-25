import { Module } from '@nestjs/common';

import { CitiesAdminController } from './cities.admin.controller';
import { CitiesPublicController } from './cities.public.controller';
import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../transports/rabbitmq.module';

@Module({
  imports: [RabbitMQModule, AuthModule],
  controllers: [CitiesAdminController, CitiesPublicController],
})
export class CitiesModule {}
