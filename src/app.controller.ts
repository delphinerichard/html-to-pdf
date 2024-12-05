import {
  BadRequestException,
  Controller,
  Get,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'buffer';
import { IHealthStatus } from './app.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async buildPdf(@UploadedFile() file: File): Promise<StreamableFile> {
    try {
      const buffer = await this.appService.buildPdf(file);
      return new StreamableFile(buffer);
    } catch (error) {
      throw new BadRequestException('PDF generation failed', error.message);
    }
  }

  @Get('health')
  checkStatus(): IHealthStatus {
    return { status: 'OK' };
  }
}
