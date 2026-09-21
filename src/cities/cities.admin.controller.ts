import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CATALOG_SERVICE } from '../config';
import { AdminOnly } from '../auth/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CitySearchDto } from './dto';

@Controller('admin/cities')
@UseGuards(AuthGuard, RolesGuard)
@AdminOnly()
export class CitiesAdminController {
  constructor(
    @Inject(CATALOG_SERVICE) private readonly catalogClient: ClientProxy,
  ) {}

  @Get()
  search(@Query() dto: CitySearchDto) {
    return this.catalogClient.send('catalog.city.search', dto);
  }

  @Get('countries')
  findCountries() {
    return this.catalogClient.send('catalog.city.findCountries', {});
  }
}
