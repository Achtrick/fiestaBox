import {
  Controller,
  Body,
  Post,
  Inject,
  Put,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';
import { PlanDocument } from './entities/plan.schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlansService } from './plans.service';
import { PLANS_SERVICE } from './plans.service.tokens';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { IsMongoId } from 'class-validator';

export class IdParamDto {
  @IsMongoId() // ← ensures “id” is a 24‑hex string
  id: string;
}

@Controller('plans')
export class PlansController {
  constructor(
    @Inject(PLANS_SERVICE) private readonly plansService: PlansService
  ) {}

  /**
   * ------------------------------ create one plan
   * @param createPlanDto
   * @returns
   */
  @Post()
  @SuccessMessage(
    (data: PlanDocument) => `Plan created successfully with ID: ${data._id}`
  )
  async create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Put(':id')
  @SuccessMessage(
    (data: PlanDocument) =>
      `Plan with ID: ${data._id} was updated successfully!`
  )
  async update(
    @Param(new ValidationPipe({ transform: true }))
    params: IdParamDto,
    @Body() updatePlanDto: UpdatePlanDto
  ) {
    return this.plansService.update(params.id, updatePlanDto);
  }
}
