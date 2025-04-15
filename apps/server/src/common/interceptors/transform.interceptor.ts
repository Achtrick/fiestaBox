import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import {
  SUCCESS_MESSAGE_KEY,
  SuccessMessageType,
} from '../decorators/success-message.decorator';
import { IResponse } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IResponse<T>> {
    // Retrieve the metadata from the handler.
    const messageMeta: SuccessMessageType<T> =
      this.reflector.get(SUCCESS_MESSAGE_KEY, context.getHandler()) ||
      'Success';

    return next.handle().pipe(
      map((data) => {
        // If the messageMeta is a function, execute it passing the response data.
        const message =
          typeof messageMeta === 'function' ? messageMeta(data) : messageMeta;
        return {
          success: true,
          data,
          message,
        };
      })
    );
  }
}
