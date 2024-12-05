import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private browser: puppeteer.Browser | null = null;
  private readonly messageErrorLaunchBrowser =
    'Erreur de lancement du navigateur Puppeteer pour de la génération du PDF';
  private readonly messageErrorCloseBrowser =
    'Erreur lors de la fermeture du navigateur Puppeteer';
  private readonly messageErrorBuildPdf = 'La génération du PDF a échoué';

  constructor() {}

  /**
   * Initialisation du navigateur Puppeteer
   */
  private async initBrowser(): Promise<void> {
    if (!this.browser) {
      try {
        this.logger.debug('Init chromium launch');
        this.browser = await puppeteer.launch({
          headless: true,
          executablePath: '/usr/bin/chromium',
          args: [
            '--no-sandbox',
            '--disable-gpu',
            '--disable-features=site-per-process',
          ],
          ignoreDefaultArgs: ['--disable-extensions'],
          timeout: 60000,
        });
        this.logger.log('Init browser success');
      } catch (error) {
        this.logger.error(this.messageErrorLaunchBrowser, error.stack);
        throw new Error(this.messageErrorLaunchBrowser);
      }
    }
  }

  /**
   * Génération du PDF
   * @param data
   * @returns un Buffer ou void
   */
  async buildPdf(data: Express.Multer.File): Promise<Buffer> {
    try {
      await this.initBrowser();

      this.logger.debug('Build pdf html content');
      const htmlContent = data.buffer.toString('utf8');

      this.logger.debug('Build pdf new page');
      const page = await this.browser.newPage();
      this.logger.debug('Build pdf set content');
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      this.logger.debug('Build pdf convert to pdf');
      const pdfArray = await page.pdf({
        width: 1280,
        height: 1900,
        scale: 1,
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      });
      this.logger.debug('Build pdf convert to buffer');
      const pdfBuffer = Buffer.from(pdfArray);

      this.logger.debug('Build pdf close');
      await page.close();

      this.logger.log('Build pdf success');
      return pdfBuffer;
    } catch (error) {
      this.logger.error(this.messageErrorBuildPdf, error);
      throw error;
    } finally {
      this.closeBrowser();
    }
  }

  /**
   * Fonction permettant de s'assurer que le navigateur est bien fermé après l'utilisation
   */
  private async closeBrowser() {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
        this.logger.log('Fermeture du navigateur Puppeteer');
      } catch (error) {
        this.logger.error(this.messageErrorCloseBrowser, error);
      }
    }
  }
}
