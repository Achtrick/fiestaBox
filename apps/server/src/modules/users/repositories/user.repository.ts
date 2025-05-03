import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.schema';
import { IUserRepository } from './user.repository.interface';
import { BaseRepository } from '../../../shared/generic-apis/repositories/base.repository';

@Injectable()
export class UserRepository
  extends BaseRepository<UserDocument>
  implements IUserRepository
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
