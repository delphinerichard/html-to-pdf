import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('checkStatus', () => {
    it('should return OK', () => {
      const result = controller.checkStatus();

      expect(result).toEqual({ status: 'OK' });
    });
  });
});
