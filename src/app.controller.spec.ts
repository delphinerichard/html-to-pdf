import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createMock } from '@golevelup/ts-jest';
import {
  htmlInputFileFixture,
  pagePdfBufferFixture,
} from 'test/fixtures/pdf.fixtures';
import { BadRequestException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: createMock<AppService>(),
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('checkStatus', () => {
    it('should return OK', () => {
      const result = appController.checkStatus();

      expect(result).toEqual({ status: 'OK' });
    });
  });

  describe('buildPdf', () => {
    it('should call service correctly', async () => {
      jest
        .spyOn(appService, 'buildPdf')
        .mockResolvedValueOnce(pagePdfBufferFixture);

      await appController.buildPdf(htmlInputFileFixture);

      expect(appService.buildPdf).toHaveBeenCalledWith(htmlInputFileFixture);
    });

    it('should throw a BadRequestException when service call fails', async () => {
      const error = new Error('Service error');
      const exception = new BadRequestException(
        'PDF generation failed',
        error.message,
      );
      jest.spyOn(appService, 'buildPdf').mockRejectedValueOnce(error);

      const call = () => appController.buildPdf(htmlInputFileFixture);

      await expect(call).rejects.toThrow(exception);
    });
  });
});
