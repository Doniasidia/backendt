//plans.service
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '@client/plans/plans.entity';
import { PlanDTO } from '@client/plans/plans.dto';
import { Status } from '@enums/status';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Plan[]> {
    return await this.planRepository.find();
  }

  async createPlan(planDTO: PlanDTO): Promise<Plan> {
    const newPlan = new Plan();
    newPlan.name = planDTO.name;
    newPlan.type = planDTO.type;
    newPlan.amount = planDTO.amount;
    newPlan.duration = planDTO.duration; 
    newPlan.nbrseance = planDTO.nbrseance;
    newPlan.enligne = planDTO.enligne;
    const savedPlan = await this.planRepository.save(newPlan);
    return savedPlan;
    
  }

  async deactivatePlan(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    plan.status = Status.DEACTIVATED;
    return await this.planRepository.save(plan);
  }
  


  
   
  async getPlanById(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
}
async updatePlanStatus(id: number, status: string): Promise<Plan> {
  const Plan = await this.planRepository.findOne({ where: { id } });
  if (!Plan) {
    throw new NotFoundException(`Plan with ID ${id} not found`);
  }

  // Validate status
  if (status !== 'activated' && status !== 'deactivated') {
    throw new NotFoundException(`Invalid status: ${status}`);
  }

  Plan.status = status === 'activated' ? Status.ACTIVATED : Status.DEACTIVATED;
  return await this.planRepository.save(Plan);
}

async updatePlan(id: number, body: PlanDTO): Promise<Plan> {
  const plan = await this.planRepository.findOne({ where: { id } });
  if (!plan) {
    throw new NotFoundException(`Plan with ID ${id} not found`);
  }

  if (body.name !== undefined) {
    plan.name = body.name;
  }
  if (body.type !== undefined) {
    plan.type = body.type;
  }
  if (body.amount !== undefined) {
    plan.amount = body.amount;
  }
 
  if (body.duration !== undefined) {
    plan.duration = body.duration;
  }
  if (body.nbrseance !== undefined) {
    plan.nbrseance = body.nbrseance;
  }
  if (body.enligne !== undefined) {
    plan.enligne = body.enligne;
  }

  const updatedPlan = await this.planRepository.save(plan);
  return updatedPlan;
}
}
