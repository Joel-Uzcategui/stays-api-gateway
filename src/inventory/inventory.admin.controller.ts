import {
  Body,
  Controller,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AdminOnly } from '../auth/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BOOKING_SERVICE } from '../config';
import { SetInventoryDto } from './dto';

@Controller('admin/inventory')
@UseGuards(AuthGuard, RolesGuard)
@AdminOnly()
export class InventoryAdminController {
  constructor(
    @Inject(BOOKING_SERVICE) private readonly bookingClient: ClientProxy,
  ) {}

  @Put()
  set(@Body() dto: SetInventoryDto) {
    return this.bookingClient.send('booking.inventory.set', dto);
  }

  @Post('rebuild')
  rebuild() {
    return this.bookingClient.send('booking.replica.rebuild', {});
  }
}
