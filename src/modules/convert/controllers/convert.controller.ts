import {
  BadRequestException,
  Body,
  Controller,
  Post,
  StreamableFile,
  Version,
} from '@nestjs/common';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConvertService } from '../services/convert.service';
import { FormatDto } from './convert.dto';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post()
  @Version('1')
  @UseInterceptors(FileInterceptor('file'))
  async buildPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() formatDto: FormatDto,
  ): Promise<StreamableFile> {
    try {
      const buffer = await this.convertService.buildPdf(file, { ...formatDto });
      return new StreamableFile(buffer);
    } catch (error) {
      throw new BadRequestException('PDF generation failed', error.message);
    }
  }
}
