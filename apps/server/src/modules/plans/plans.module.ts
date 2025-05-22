import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { Plan, PlanSchema } from './entities/plan.schema';
import { PlanRepository } from './repositories/plan.repository';
import { PLANS_REPOSITORY, PLANS_SERVICE } from './plans.service.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
  ],
  controllers: [PlansController],
  providers: [
    {
      provide: PLANS_SERVICE,
      useClass: PlansService,
    },
    // Bind the interface to the concrete repository implementation:
    {
      provide: PLANS_REPOSITORY,
      useClass: PlanRepository,
    },
  ],
  exports: [PLANS_SERVICE],
})
export class PlansModule {}
