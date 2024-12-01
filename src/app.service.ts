import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
export type ApiResponsePdfWithBuffer = {
  success: boolean;
  message: string;
  buffer: Buffer | null;
};

@Injectable()
export class AppService implements OnModuleDestroy, OnModuleInit {
  private browser: puppeteer.Browser | null = null;
  private readonly messageErrorLaunchBrowser =
    'Erreur de lancement du navigateur Puppeteer pour de la génération du PDF';
  private readonly messageErrorCloseBrowser =
    'Erreur lors de la fermeture du navigateur Puppeteer';
  private readonly messageErrorInitBrowser =
    "Le navigateur Puppeteer n'a pas pu être initialisé, une erreur est survenue lors de son lancement";
  private readonly messageSuccessGeneratePDF =
    'Le PDF a été généré avec succès';

  constructor() {}

  /**
   * Initialisation de l'instance de navigateur de Puppeteer (Singleton)
   */
  async onModuleInit() {
    await this.initBrowser();
  }

  /**
   * Initialisation du navigateur Puppeteer
   */
  private async initBrowser(): Promise<void> {
    if (!this.browser) {
      try {
        this.browser = await puppeteer.launch({
          headless: true,
          executablePath: '/usr/bin/google-chrome',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-dev-shm-usage',
            '--no-xshm',
            '--single-process',
          ],
          ignoreDefaultArgs: ['--disable-extensions'],
          timeout: 60000,
        });
        Logger.log('Lancement du navigateur Puppeteer');
      } catch (error) {
        Logger.error(this.messageErrorLaunchBrowser, error.stack);
        throw new Error(this.messageErrorLaunchBrowser);
      }
    }
  }

  /**
   * Génération du PDF
   * @param data
   * @returns un objet Buffer ou null
   */
  async buildPdf(data): Promise<ApiResponsePdfWithBuffer> {
    const htmlContent = data.buffer.toString('utf8');

    if (!this.browser) {
      throw new Error(this.messageErrorInitBrowser);
    }

    const page = await this.browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = Buffer.from(
      await page.pdf({
        width: 1280,
        height: 1900,
        scale: 1,
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      }),
    );

    await page.close();
    return {
      success: true,
      message: this.messageSuccessGeneratePDF,
      buffer: pdfBuffer,
    };
  }

  /**
   * Fonction permettant de s'assurer que le navigateur est bien fermé après l'utilisation
   */
  async onModuleDestroy() {
    if (this.browser) {
      try {
        await this.browser.close();
        Logger.log('Fermeture du navigateur Puppeteer');
      } catch (error) {
        Logger.error(this.messageErrorCloseBrowser, error);
      }
    }
  }
}
