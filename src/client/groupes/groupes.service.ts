//groupes.service
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupeDTO} from '@client/groupes/groupes.dto'; 
import { Groupe } from '@client/groupes/groupes.entity';
import { Status } from '@enums/status';
import { Plan } from '@client/plans/plans.entity';

@Injectable()
export class GroupesService {
  constructor(
    @InjectRepository(Groupe)
    private readonly groupeRepository: Repository<Groupe>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Groupe[]> {
    return await this.groupeRepository.find();
  }

  async createGroupe(groupeDTO: GroupeDTO): Promise<Groupe> {
    try{
    const planId = await this.planRepository.findOne({ where: { name: groupeDTO.planName } });
    const newGroupe = new Groupe();
    newGroupe.name = groupeDTO.name;
    newGroupe.planId = planId?.id;
    const savedGroupe = await this.groupeRepository.save(newGroupe);
        
    return savedGroupe;
} catch (error) {
    // Handle any errors that occur during the process
    console.error('Error creating subscriber:', error);
    throw error; // Optionally, you can throw the error to be handled by the caller
}
}
  
  

   
   
  async deactivateGroupe(id: number): Promise<Groupe> {
    const groupe= await this.groupeRepository.findOne({ where: { id } });
    if (!groupe) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    groupe.status = Status.DEACTIVATED;
    return await this.groupeRepository.save(groupe);
  }
  


  
   
  async getGroupeById(id: number): Promise<Groupe> {
    const groupe = await this.groupeRepository.findOne({ where: { id } });
    if (!groupe) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return groupe;
}
async updateGroupeStatus(id: number, status: string): Promise<Groupe> {
  const Groupe = await this.groupeRepository.findOne({ where: { id } });
  if (!Groupe) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }

  // Validate status
  if (status !== 'activated' && status !== 'deactivated') {
    throw new NotFoundException(`Invalid status: ${status}`);
  }

  Groupe.status = status === 'activated' ? Status.ACTIVATED : Status.DEACTIVATED;
  return await this.groupeRepository.save(Groupe);
}

async updateGroupe(id: number, body: GroupeDTO): Promise<Groupe> {
  const groupe= await this.groupeRepository.findOne({ where: { id } });
  if (!groupe) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }

  if (body.name !== undefined) {
    groupe.name = body.name;
  }
 
 
 
 


  const updatedGroupe = await this.groupeRepository.save(groupe);
  return updatedGroupe;
}
}
