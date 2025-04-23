import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from '../database/database.module';
import featuresModule from '../modules/features.module';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { MyMailerModule } from '../common/mail/mailer.module';
import { OwnerGuard } from '../common/guards/owner.guard';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Module({
  imports: [DataBaseModule, MyMailerModule, featuresModule],
  controllers: [AppController],
  providers: [
    AppService,
    TransformInterceptor,
    AllExceptionsFilter,
    OwnerGuard,
    JwtAuthGuard,
    AdminGuard,
  ],
})
export class AppModule {}
