import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RabbitMQModule } from '../transports/rabbitmq.module';
import { envs } from '../config';

@Module({
  imports: [
    RabbitMQModule,
    JwtModule.register({
      global: true,
      publicKey: envs.jwtPublicKey,
      verifyOptions: { algorithms: ['RS256'] },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard],
})
export class AuthModule {}
