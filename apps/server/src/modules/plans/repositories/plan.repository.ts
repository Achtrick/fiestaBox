import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../../../shared/generic-apis/repositories/base.repository';
import { Plan, PlanDocument } from '../entities/plan.schema';
import { IPlanRepository } from './plan.repository.interface';

@Injectable()
export class PlanRepository
  extends BaseRepository<PlanDocument>
  implements IPlanRepository
{
  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<PlanDocument>
  ) {
    super(planModel);
  }
}
