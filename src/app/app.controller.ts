import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/reverse-geocoding/')
  async getReverseGeocoding(@Query('lat') latitude, @Query('lng') longitude) {
    return await this.appService.geocode({ latitude, longitude });
  }
}
