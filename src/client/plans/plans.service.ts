//plans.service
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '@client/plans/plans.entity';
import { PlanDTO } from '@client/plans/plans.dto';
import { Status } from '@enums/status';
import { Client } from '@admin/client/client.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Client) // Inject the Client repository
    private clientRepository: Repository<Client>,
  ) {}

  async findPlansByClientId(clientId: number): Promise<Plan[]> {
    return await this.planRepository.find({
      where: {
        createdBy: { id: clientId }
      }
    });
  }

  async createPlan(planDTO: PlanDTO, clientId: number): Promise<Plan> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });

    const newPlan = new Plan();
    newPlan.name = planDTO.name;
    newPlan.type = planDTO.type;
    newPlan.amount = planDTO.amount;
    newPlan.duration = planDTO.duration; 
    newPlan.nbrseance = planDTO.nbrseance;
    newPlan.enligne = planDTO.enligne;
    newPlan.startDate = planDTO.startDate;
    newPlan.endDate = planDTO.endDate;
    newPlan.createdBy = client;

    const insertResult = await this.planRepository.insert(newPlan);
    const savedPlan= await this.planRepository.findOne({
      where: { id: insertResult.identifiers[0].id }
    });    
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
  

  async findAll(): Promise<Plan[]> {
    return await this.planRepository.find();
  }
  
   
  async getPlanById(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return plan;
}
async updatePlanStatus(id: number, status: string): Promise<Plan> {
  const Plan = await this.planRepository.findOne({ where: { id } });
  if (!Plan) {
    throw new NotFoundException(`Client with ID ${id} not found`);
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
    throw new NotFoundException(`Client with ID ${id} not found`);
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
  if (body.startDate !== undefined) {
    plan.startDate = body.startDate;
  }
  if (body.endDate !== undefined) {
    plan.endDate = body.endDate;
  }
  const updatedPlan = await this.planRepository.save(plan);
  return updatedPlan;
}
}
