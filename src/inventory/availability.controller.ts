import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { BOOKING_SERVICE } from '../config';
import { CheckAvailabilityDto } from './dto';

@Controller('availability')
export class AvailabilityController {
  constructor(
    @Inject(BOOKING_SERVICE) private readonly bookingClient: ClientProxy,
  ) {}

  @Get()
  check(@Query() dto: CheckAvailabilityDto) {
    return this.bookingClient.send('booking.availability.check', dto);
  }
}
