import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [AuthModule, EventsModule, UsersModule, AlbumsModule, PlansModule],
})
export default class featuresModule {}
