import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const exceptionHandler = baseOnContextType(host);
    exceptionHandler.handle(host, exception);
  }
}

function baseOnContextType(context: ArgumentsHost) {
  const type = context.getType();
  switch (type) {
    case 'http':
      return new HandleHttpException();
    case 'ws':
      return new HandleWsException();
    case 'rpc':
      return new HandleRpcException();
    default:
      console.log('Unknown Exception Type');
      return null;
  }
}

function handleHttpContext(context: ArgumentsHost, exception: HttpException) {
  const [req, res, next] = context.getArgs();
  const status = exception.getStatus();
  console.log('Exception:', exception);
  const error = exception.getResponse();

  res.status(status).json({
    error: error,
    timestamp: convertDateToFormat('DD-MM-YYYY', new Date()),
    path: req.url,
  });
}

function handleWsContext(context: ArgumentsHost) {
  console.log('WS Exception:');
}

function handleRpcContext(context: ArgumentsHost) {
  console.log('RPC Exception:');
}

function convertDateToFormat(
  format: 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD',
  date: Date,
) {
  const datePart = date.getDate();
  const monthPart = date.getMonth() + 1;
  const yearPart = date.getFullYear();
  const timePart =
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  switch (format) {
    case 'DD-MM-YYYY':
      return `${datePart}-${monthPart}-${yearPart} ${timePart}`;
    case 'MM-DD-YYYY':
      return `${monthPart}-${datePart}-${yearPart} ${timePart}`;
    case 'YYYY-MM-DD':
      return `${yearPart}-${monthPart}-${datePart} ${timePart}`;
    default:
      return `${datePart}-${monthPart}-${yearPart} ${timePart}`;
  }
}

interface HandleException {
  handle(context: ArgumentsHost, exception: HttpException): void;
}

class HandleHttpException implements HandleException {
  handle(context: ArgumentsHost, exception: HttpException) {
    handleHttpContext(context, exception);
  }
}

class HandleWsException implements HandleException {
  handle(context: ArgumentsHost, exception: HttpException) {
    handleWsContext(context);
  }
}

class HandleRpcException implements HandleException {
  handle(context: ArgumentsHost, exception: HttpException) {
    handleRpcContext(context);
  }
}
