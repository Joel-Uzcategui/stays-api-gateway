import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface RpcErrorShape {
  status: unknown;
  message: unknown;
}

@Catch()
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcCustomExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    const error =
      exception instanceof RpcException ? exception.getError() : exception;

    if (typeof error === 'string' && error.includes('Empty response')) {
      this.logger.error(error);
      return response
        .status(503)
        .json({ status: 503, message: 'Service unavailable' });
    }

    if (this.isRpcErrorShape(error)) {
      const parsed = Number(error.status);
      const status = Number.isNaN(parsed) ? 400 : parsed;
      return response.status(status).json({ status, message: error.message });
    }

    this.logger.error(exception);
    return response
      .status(500)
      .json({ status: 500, message: 'Internal server error' });
  }

  private isRpcErrorShape(error: unknown): error is RpcErrorShape {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'message' in error
    );
  }
}
