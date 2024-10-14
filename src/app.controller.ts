import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async verifyConnection() {
    return 'DCaprio Backend connection success!';
  }

  @Get('/test')
  async testConnection() {
    return 'deleted ecosystem.config';
  }
}
