import { Module } from '@nestjs/common';

import { AmenitiesModule } from './amenities/amenities.module';
import { AuthModule } from './auth/auth.module';
import { CitiesModule } from './cities/cities.module';
import { HealthController } from './health/health.controller';
import { HotelsModule } from './hotels/hotels.module';
import { SearchModule } from './search/search.module';
import { PhotosModule } from './photos/photos.module';
import { RoomTypesModule } from './room-types/room-types.module';

@Module({
  imports: [
    AuthModule,
    CitiesModule,
    HotelsModule,
    SearchModule,
    RoomTypesModule,
    AmenitiesModule,
    PhotosModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
