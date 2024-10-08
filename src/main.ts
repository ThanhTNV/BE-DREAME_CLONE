import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformDataInterceptor } from './common/interceptors/transform-data/transform-data.interceptor';
import { Utils } from './common/utils/utils';
import { loggerMiddleware } from './common/middlewares/logger-middleware/logger-middleware.middleware';
import { HttpExceptionsFilter } from './common/filters/http-exception-filter/http-exception-filter.filter';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth-guard.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformDataInterceptor(new Utils()));
  app.enableCors();
  app.use(loggerMiddleware);
  app.useGlobalFilters(new HttpExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  //Swagger
  const options = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document, {
    jsonDocumentUrl: '/json',
  });

  await app.listen(3001);
}
bootstrap();
