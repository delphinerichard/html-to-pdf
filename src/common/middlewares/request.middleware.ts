import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const start = Date.now();
    const userAgent = request.get('user-agent') || '';

    this.logger.log(`[Request] ${method} ${originalUrl} - ${userAgent} ${ip}`);

    response.on('close', () => {
      const { statusCode } = response;
      const duration = Date.now() - start;

      this.logger.log(
        `[Response] ${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip} +${duration}ms`,
      );
    });

    next();
  }
}
