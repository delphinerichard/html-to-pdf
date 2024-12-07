import { Readable } from 'stream';

export const bufferToStringFixture = 'mock content';

export const htmlInputFileFixture: Express.Multer.File = {
  buffer: Buffer.from(bufferToStringFixture),
  destination: 'uploads/',
  encoding: null,
  fieldname: 'file',
  filename: 'test.pdf',
  mimetype: 'application/pdf',
  originalname: 'test-image.pdf',
  path: 'uploads/test.pdf',
  size: 53,
  stream: new Readable(),
};

export const pagePdfArrayFixture: Uint8Array = new Uint8Array([0, 1, 2]);

export const pagePdfBufferFixture = Buffer.from(pagePdfArrayFixture);

export const buildPdfLaunchOptionsFixture = {
  headless: true,
  executablePath: '/usr/bin/chromium',
  args: [
    '--no-sandbox',
    '--disable-gpu',
    '--disable-features=site-per-process',
  ],
  ignoreDefaultArgs: ['--disable-extensions'],
  timeout: 60000,
};

export const buildPdfSetContentOptionsFixture = { waitUntil: 'networkidle0' };

export const buildPdfPageFixture = {
  width: 1280,
  height: 1900,
  scale: 1,
  printBackground: true,
  margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
};
