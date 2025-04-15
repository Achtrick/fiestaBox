import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from '../database/database.module';
import featuresModule from '../modules/features.module';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter';

@Module({
  imports: [DataBaseModule, featuresModule],
  controllers: [AppController],
  providers: [AppService, TransformInterceptor, AllExceptionsFilter],
})
export class AppModule {}
