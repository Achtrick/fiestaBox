import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from '../database/database.module';
import featuresModule from '../modules/features.module';

@Module({
  imports: [DataBaseModule, featuresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
