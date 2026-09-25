import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CATALOG_SERVICE } from '../config';
import { CitySearchDto } from './dto';

@Controller('cities')
export class CitiesPublicController {
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
