import { Logger, Module } from '@nestjs/common';
import { ConvertController } from './controllers/convert.controller';
import { ConvertService } from './services/convert.service';

@Module({
  controllers: [ConvertController],
  providers: [ConvertService, Logger],
  exports: [],
})
export class ConvertModule {}
