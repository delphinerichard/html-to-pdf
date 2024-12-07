import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  bufferToStringFixture,
  buildPdfLaunchOptionsFixture,
  buildPdfPageFixture,
  buildPdfSetContentOptionsFixture,
  htmlInputFileFixture,
  pagePdfArrayFixture,
  pagePdfBufferFixture,
} from 'test/fixtures/pdf.fixtures';
import { AppService } from './app.service';
import {
  mockBrowser,
  mockCloseBrowser,
  mockLaunch,
  mockNewPage,
  mockPage,
  mockPdf,
  mockSetContent,
} from 'test/mocks/puppeteer.mocks';
import { Logger } from '@nestjs/common';

jest.mock('puppeteer', () => ({
  launch: (...args: unknown[]) => mockLaunch(...args),
}));

describe('AppService', () => {
  let service: AppService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: Logger,
          useValue: createMock<Logger>(),
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    logger = module.get<Logger>(Logger);
  });

  describe('buildPdf', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should build pdf from input file', async () => {
      mockLaunch.mockResolvedValueOnce(mockBrowser);
      mockNewPage.mockResolvedValueOnce(mockPage);
      mockPdf.mockResolvedValueOnce(pagePdfArrayFixture);

      const result = await service.buildPdf(htmlInputFileFixture);

      expect(mockLaunch).toHaveBeenCalledWith(buildPdfLaunchOptionsFixture);
      expect(mockNewPage).toHaveBeenCalledTimes(1);
      expect(mockSetContent).toHaveBeenCalledWith(
        bufferToStringFixture,
        buildPdfSetContentOptionsFixture,
      );
      expect(mockPdf).toHaveBeenCalledWith(buildPdfPageFixture);
      expect(mockCloseBrowser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(pagePdfBufferFixture);
    });

    it('should throw if browser init fails', async () => {
      const error = new Error('Fail to launch');
      const launchErrorMessage =
        'Erreur de lancement du navigateur Puppeteer pour de la génération du PDF';
      mockLaunch.mockRejectedValueOnce(error);

      const call = () => service.buildPdf(htmlInputFileFixture);

      await expect(call).rejects.toThrow(new Error(launchErrorMessage));
      expect(logger.debug).toHaveBeenCalledWith('Init chromium launch');
      expect(mockLaunch).toHaveBeenCalledTimes(1);
      expect(logger.log).not.toHaveBeenCalledWith('Init browser success');
      expect(mockNewPage).not.toHaveBeenCalled();
      expect(mockCloseBrowser).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        launchErrorMessage,
        expect.anything(),
      );
    });

    it('should throw if browser newPage fails and close browser', async () => {
      const error = new Error('Fail to add new page');
      mockLaunch.mockResolvedValueOnce(mockBrowser);
      mockNewPage.mockRejectedValueOnce(error);

      const call = () => service.buildPdf(htmlInputFileFixture);

      await expect(call).rejects.toThrow(error);
      expect(mockLaunch).toHaveBeenCalledTimes(1);
      expect(mockNewPage).toHaveBeenCalledTimes(1);
      expect(mockSetContent).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        'La génération du PDF a échoué',
        expect.anything(),
      );
      expect(mockCloseBrowser).toHaveBeenCalledTimes(1);
    });

    it('should throw if a step fails and log error when unable to close browser', async () => {
      const error = new Error('Unexpected error');
      const closingError = new Error('Closing error');
      mockLaunch.mockResolvedValueOnce(mockBrowser);
      mockNewPage.mockResolvedValueOnce(mockPage);
      mockSetContent.mockRejectedValueOnce(error);
      mockCloseBrowser.mockRejectedValueOnce(closingError);

      const call = () => service.buildPdf(htmlInputFileFixture);

      await expect(call).rejects.toThrow(error);
      expect(mockLaunch).toHaveBeenCalledTimes(1);
      expect(mockNewPage).toHaveBeenCalledTimes(1);
      expect(mockSetContent).toHaveBeenCalledTimes(1);
      expect(mockPdf).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenNthCalledWith(
        1,
        'La génération du PDF a échoué',
        expect.anything(),
      );
      expect(mockCloseBrowser).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenNthCalledWith(
        2,
        'Erreur lors de la fermeture du navigateur Puppeteer',
        closingError,
      );
    });
  });
});
