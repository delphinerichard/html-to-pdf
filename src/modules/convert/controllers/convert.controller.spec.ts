import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  htmlInputFileFixture,
  pagePdfBufferFixture,
} from 'test/fixtures/pdf.fixtures';
import { BadRequestException } from '@nestjs/common';
import { ConvertController } from './convert.controller';
import { ConvertService } from '../services/convert.service';

describe('ConvertController', () => {
  let controller: ConvertController;
  let appService: ConvertService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConvertController],
      providers: [
        {
          provide: ConvertService,
          useValue: createMock<ConvertService>(),
        },
      ],
    }).compile();

    controller = app.get<ConvertController>(ConvertController);
    appService = app.get<ConvertService>(ConvertService);
  });

  describe('buildPdf', () => {
    it('should call service correctly', async () => {
      jest
        .spyOn(appService, 'buildPdf')
        .mockResolvedValueOnce(pagePdfBufferFixture);

      await controller.buildPdf(htmlInputFileFixture);

      expect(appService.buildPdf).toHaveBeenCalledWith(htmlInputFileFixture);
    });

    it('should throw a BadRequestException when service call fails', async () => {
      const error = new Error('Service error');
      const exception = new BadRequestException(
        'PDF generation failed',
        error.message,
      );
      jest.spyOn(appService, 'buildPdf').mockRejectedValueOnce(error);

      const call = () => controller.buildPdf(htmlInputFileFixture);

      await expect(call).rejects.toThrow(exception);
    });
  });
});
