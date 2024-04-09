//groupes.service
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupeDTO} from '@client/groupes/groupes.dto'; 
import { Groupe } from '@client/groupes/groupes.entity';
import { Status } from '@enums/status';

@Injectable()
export class GroupesService {
  constructor(
    @InjectRepository(Groupe)
    private readonly groupeRepository: Repository<Groupe>,
  ) {}

  async findAll(): Promise<Groupe[]> {
    return await this.groupeRepository.find();
  }

  async createGroupe(groupeDTO: GroupeDTO): Promise<Groupe> {
    const newGroupe = new Groupe();
    newGroupe.name = groupeDTO.name;
    newGroupe.plan = groupeDTO.plan;
  
  
    newGroupe.nbrab = groupeDTO.nbrab;
   
    const savedGroupe = await this.groupeRepository.save(newGroupe);
    return savedGroupe;
    
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
  if (body.plan !== undefined) {
    groupe.plan = body.plan;
  }
 
 
  if (body.nbrab !== undefined) {
    groupe.nbrab = body.nbrab;
  }
 


  const updatedGroupe = await this.groupeRepository.save(groupe);
  return updatedGroupe;
}
}
