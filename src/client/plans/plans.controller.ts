//plans.controller
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Patch, UseGuards, Request } from '@nestjs/common';
import { PlansService } from '@client/plans/plans.service';
import { PlanDTO} from '@client/plans/plans.dto'; 
import { Plan } from '@client/plans/plans.entity';
import { AuthGuard } from '@auth/auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('plans')
export class PlansController {
  constructor(
    private readonly plansService: PlansService,
    @InjectRepository(Plan) // Inject Plan repository
    private readonly planRepository: Repository<Plan>,
  )
   {}
  

  @UseGuards(AuthGuard)
  @Get()
  async getAllPlans(@Request() req): Promise<Plan[]> {
    // Get the user ID from the request object (assuming it's stored in the user property)
    const clientId = req.user.sub;
    return await this.plansService.findPlansByClientId(clientId);
  }
  @Get('/allplans')
  async getPlans(): Promise<Plan[]> {
    try {
      // Use the service to fetch all plans (without relations)
      const plans = await this.plansService.findAll();
  
      // Use planRepository with relations to fetch createdBy data for each plan
      const plansWithCreatedBy = await Promise.all(
        plans.map(async (plan) => {
          const populatedPlan = await this.planRepository.findOne({
            where: { id: plan.id },
            relations: ["createdBy"], // Include createdBy relation
          });
          return populatedPlan;
        })
      );
  
      return plansWithCreatedBy;
    } catch (error) {
      throw new NotFoundException("Unable to fetch plans.");
    }
  }
  
  @UseGuards(AuthGuard)
  @Post()
  async createPlan(@Body() planDTO: PlanDTO, @Request() req): Promise<Plan> {
    // Get the user ID from the request object (assuming it's stored in the user property)
    const clientId = req.user.sub;
    return await this.plansService.createPlan(planDTO, clientId);
  }

  @Patch(':id')
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