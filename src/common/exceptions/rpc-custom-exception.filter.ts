import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcCustomExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const rpcError = exception.getError();

    if (typeof rpcError === 'string' && rpcError.includes('Empty response')) {
      this.logger.error(rpcError);
      return response.status(503).json({
        status: 503,
        message: 'Service unavailable',
      });
    }

    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const raw = (rpcError as { status: unknown }).status;
      const status = Number.isNaN(Number(raw)) ? 400 : Number(raw);
      return response.status(status).json({
        status,
        message: (rpcError as { message: unknown }).message,
      });
    }

    return response.status(400).json({ status: 400, message: rpcError });
  }
}
