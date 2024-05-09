import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(HttpException)
export class ExceptionMiddleware implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorInstanceStatus =
      exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage: any = '';
    let errorDetail: any = '';
    if (exception instanceof ZodValidationException) {
      errorMessage = 'Invalid form validation';
      console.log('ex=>>>>', exception);
      errorDetail = exception.getZodError().formErrors.fieldErrors;
    } else if (exception instanceof ZodError) {
      errorMessage = exception.formErrors.fieldErrors;
    } else if (exception instanceof HttpException) {
      errorMessage =
        exception.getResponse()['message'] ||
        exception.message ||
        exception.getResponse();
    }

    const result: any = {
      statusCode: errorInstanceStatus,
      statusDescription: errorMessage,
    };

    if (errorDetail !== '') {
      result.errorDetail = errorDetail;
    }

    response.status(errorInstanceStatus).json(result);
  }
}
