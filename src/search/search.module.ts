import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../transports/rabbitmq.module';
import { SearchController } from './search.controller';

@Module({
  imports: [RabbitMQModule, AuthModule],
  controllers: [SearchController],
})
export class SearchModule {}
