import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CurrentUser } from '../auth/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BOOKING_SERVICE } from '../config';
import { CreateBookingDto, ListBookingsDto } from './dto';

@Controller()
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(
    @Inject(BOOKING_SERVICE) private readonly bookingClient: ClientProxy,
  ) {}

  @Post('bookings')
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateBookingDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.bookingClient.send('booking.create', {
      ...dto,
      userId,
      ...(idempotencyKey ? { idempotencyKey } : {}),
    });
  }

  @Get('me/bookings')
  findMine(@CurrentUser('sub') userId: string, @Query() dto: ListBookingsDto) {
    return this.bookingClient.send('booking.findMine', { ...dto, userId });
  }

  @Get('bookings/:id')
  findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.bookingClient.send('booking.findOne', { id, userId });
  }

  @Post('bookings/:id/cancel')
  cancel(
    @CurrentUser('sub') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.bookingClient.send('booking.cancel', { id, userId });
  }
}
