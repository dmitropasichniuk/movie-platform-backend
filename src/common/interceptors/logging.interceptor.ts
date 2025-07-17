import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, tap, catchError, throwError } from "rxjs";
import { LoggerService } from "@utils";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.originalUrl;
    const ip = request.ip || request.connection.remoteAddress;

    LoggerService.log(
      LoggingInterceptor.name,
      `--> ${method} ${url} from ${ip}`
    );

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const status = response.statusCode;

        LoggerService.log(
          LoggingInterceptor.name,
          `<-- ${method} ${url} ${status} - ${Date.now() - now}ms`
        );
      }),
      catchError((err) => {
        LoggerService.error(
          LoggingInterceptor.name,
          `! ${method} ${url} failed after ${Date.now() - now}ms`,
          err?.stack
        );
        return throwError(() => err);
      })
    );
  }
}
