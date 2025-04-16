import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserRepository } from './repositories/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByVerificationToken(token: string): Promise<UserDocument | null> {
    return this.userRepository.findByVerificationToken(token);
  }

  async create(
    createUserDto: CreateUserDto & {
      isVerified?: boolean;
      verificationToken?: string;
    }
  ): Promise<UserDocument> {
    return this.userRepository.create(createUserDto);
  }

  async update(id: string, updateData: Partial<User>): Promise<UserDocument> {
    const updatedUser = this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }
}
