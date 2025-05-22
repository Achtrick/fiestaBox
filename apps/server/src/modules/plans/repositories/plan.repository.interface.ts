import { IBaseRepository } from '../../../shared/generic-apis/repositories/base.repository.interface';
import { PlanDocument } from '../entities/plan.schema';

export interface IPlanRepository extends IBaseRepository<PlanDocument> {}
