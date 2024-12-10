import { Controller, Get } from '@nestjs/common';
import { IHealthStatus } from './app.interface';

@Controller()
export class AppController {
  @Get('health')
  checkStatus(): IHealthStatus {
    return { status: 'OK' };
  }
}
