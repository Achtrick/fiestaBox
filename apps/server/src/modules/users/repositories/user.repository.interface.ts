import { IBaseRepository } from '../../../shared/repositories/base.repository.interface';
import { UserDocument } from '../entities/user.schema';

export interface IUserRepository extends IBaseRepository<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
}
