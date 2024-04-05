//plans.controller
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Patch } from '@nestjs/common';
import { PlansService } from '@client/plans/plans.service';
import { PlanDTO} from '@client/plans/plans.dto'; 
import { Plan } from '@client/plans/plans.entity';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async getAllPlans(): Promise<Plan[]> {
    return await this.plansService.findAll(); // Using the 'findAll' method from the service
  }

  
  @Post()
  async createPlan(@Body() PlanDTO: PlanDTO): Promise<Plan> {
    return await this.plansService.createPlan(PlanDTO);
  }

  @Put(':id')
  async updatePlan(@Param('id') id: number, @Body() PlanDTO: PlanDTO): Promise<Plan> {
    return await this.plansService.updatePlan(id, PlanDTO);
  }
  @Patch(':id/deactivate') 
  async deactivatePlan(@Param('id') id: number): Promise<Plan> {
    try {
      return await this.plansService.deactivatePlan(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get(':id')
    async getPlanById(@Param('id') id: string): Promise<Plan> {
      return await this.plansService.getPlanById(+id); 
    }
  
  @Patch(':id/status')
  async updatePlanStatus(@Param('id') id: number, @Body() body: { status: string }): Promise<Plan> {
    try {
      return await this.plansService.updatePlanStatus(id, body.status);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  

}