import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  const isEnvDev = process.env.NODE_ENV === 'development';

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI, // Use URI versioning (/v1/module)
  });

  if (isEnvDev) {
    app.enableCors();
  }

  await app.listen(port);
}
bootstrap();
