import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { HotelsModule } from './hotels/hotels.module';

@Module({
  imports: [AuthModule, HotelsModule],
  controllers: [HealthController],
})
export class AppModule {}
