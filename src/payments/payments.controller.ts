import {
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CurrentUser } from '../auth/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PAYMENT_SERVICE } from '../config';

@Controller()
@UseGuards(AuthGuard)
export class PaymentsController {
  constructor(
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  @Post('bookings/:id/payment')
  createIntent(
    @CurrentUser('sub') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) bookingId: string,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentClient.send('payment.intent.create', {
      bookingId,
      userId,
      ...(idempotencyKey ? { idempotencyKey } : {}),
    });
  }

  @Get('bookings/:id/payment')
  findByBooking(
    @CurrentUser('sub') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) bookingId: string,
  ) {
    return this.paymentClient.send('payment.findByBooking', {
      bookingId,
      userId,
    });
  }

  @Get('payments/:id')
  findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.paymentClient.send('payment.findOne', { id, userId });
  }
}
