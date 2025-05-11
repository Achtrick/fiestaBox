import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = process.env.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that are not in the DTO
      forbidNonWhitelisted: true, // throws error if unknown props exist
      transform: true, // transforms payloads to DTO instances
    })
  );

  const transformInterceptor = app.get(TransformInterceptor);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalInterceptors(transformInterceptor);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  app.enableCors({ origin: '*' });

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
