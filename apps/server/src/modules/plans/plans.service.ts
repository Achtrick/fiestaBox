import { Injectable, Inject } from '@nestjs/common';
import { Plan } from './entities/plan.schema';
import { IPlanRepository } from './repositories/plan.repository.interface';
import { PLANS_REPOSITORY } from './plans.service.tokens';
import { BaseService } from '../../shared/generic-apis/service/base.service';
import { BaseRepository } from '../../shared/generic-apis/repositories/base.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PlansService extends BaseService<Plan> {
  // Using a custom injection token to get the repository implementation.
  constructor(
    @InjectModel(Plan.name) model: Model<Plan>,
    @Inject(PLANS_REPOSITORY) private readonly planRepo: IPlanRepository
  ) {
    super(new BaseRepository<Plan>(model));
  }
}
