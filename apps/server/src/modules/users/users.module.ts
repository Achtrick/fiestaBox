import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './entities/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersService,
    // Bind the interface to the concrete repository implementation:
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],

  exports: [UsersService],
})
export class UsersModule {}
