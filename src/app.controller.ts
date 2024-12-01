import {
  BadRequestException,
  Controller,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { ApiResponsePdfWithBuffer, AppService } from './app.service';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'buffer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async buildPdf(@UploadedFile() file: File): Promise<StreamableFile> {
    const response: ApiResponsePdfWithBuffer =
      await this.appService.buildPdf(file);
    try {
      if (response.success) {
        return new StreamableFile(response.buffer);
      }
    } catch (error) {
      throw new BadRequestException('PDF generation failed', error.message);
    }
  }
}
