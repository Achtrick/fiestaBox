import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from '../database/database.module';
import featuresModule from '../modules/features.module';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { MyMailerModule } from '../common/mail/mailer.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { OwnerGuard } from '../common/guards/owner.guard';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
// import { join } from 'path';
// import { UPLOAD_FOLDER } from '../shared/upload/constants/upload.constants';

@Module({
  imports: [
    DataBaseModule,
    MyMailerModule,
    featuresModule,

    // serve anything under dist/apps/server/uploads at http://<host>/uploads/*
    // will add this code later to serve static images of backgrounds
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, UPLOAD_FOLDER),
    //   serveRoot: `/${UPLOAD_FOLDER}`,
    // }),
  ],
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
