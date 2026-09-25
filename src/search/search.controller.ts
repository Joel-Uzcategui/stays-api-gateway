import {
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AdminOnly } from '../auth/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SEARCH_SERVICE } from '../config';
import { SearchHotelsDto } from './dto';

@Controller('search')
export class SearchController {
  constructor(
    @Inject(SEARCH_SERVICE) private readonly searchClient: ClientProxy,
  ) {}

  @Get()
  search(@Query() dto: SearchHotelsDto) {
    return this.searchClient.send('search.hotel.search', dto);
  }

  @Post('rebuild')
  @UseGuards(AuthGuard, RolesGuard)
  @AdminOnly()
  rebuild() {
    return this.searchClient.send('search.index.rebuild', {});
  }
}
