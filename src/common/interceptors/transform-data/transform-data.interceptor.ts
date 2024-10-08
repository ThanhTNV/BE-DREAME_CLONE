import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { Utils } from 'src/common/utils/utils';

interface Response<T> {
  data: T;
}
@Injectable()
export class TransformDataInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly utils: Utils) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const now = Date.now();
    const routeHandler = next.handle();
    const newRouteHandler = routeHandler.pipe(
      map((data) => this.utils.convertDateFromData(data, 'DD-MM-YYYY')),
      tap(() => console.log(`After: ${Date.now() - now} ms`)),
    );
    return newRouteHandler;
  }
}
