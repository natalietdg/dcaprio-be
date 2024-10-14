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
  async test() {
    return 'deployment success!';
  }
}
