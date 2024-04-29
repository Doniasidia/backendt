//abonnements.service
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbonnementDTO } from './abonnements.dto';
import { Abonnement } from './abonnements.entity';
import { Status } from '@enums/status';


@Injectable()
export class AbonnementsService {
  constructor(
    @InjectRepository(Abonnement)
    private readonly abonnementRepository: Repository<Abonnement>,
   
  ) {}

  async findAll(): Promise<Abonnement[]> {
    return await this.abonnementRepository.find();
  }

  async createAbonnement(abonnementDTO: AbonnementDTO): Promise<Abonnement> {
    try{
    
    const newAbonnement = new Abonnement();
    newAbonnement.name = abonnementDTO.name;
  
    const savedAbonnement = await this.abonnementRepository.save(newAbonnement);
        
    return savedAbonnement;
} catch (error) {
    // Handle any errors that occur during the process
    console.error('Error creating subscriber:', error);
    throw error; // Optionally, you can throw the error to be handled by the caller
}
}
  
  

   
   
  async deactivateAbonnement(id: number): Promise<Abonnement> {
    const abonnement= await this.abonnementRepository.findOne({ where: { id } });
    if (!abonnement) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    abonnement.status = Status.DEACTIVATED;
    return await this.abonnementRepository.save(abonnement);
  }
  


  
   
  async getAbonnementById(id: number): Promise<Abonnement> {
    const abonnement = await this.abonnementRepository.findOne({ where: { id } });
    if (!abonnement) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return abonnement;
}
async updateAbonnementStatus(id: number, status: string): Promise<Abonnement> {
  const Abonnement = await this.abonnementRepository.findOne({ where: { id } });
  if (!Abonnement) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }

  // Validate status
  if (status !== 'activated' && status !== 'deactivated') {
    throw new NotFoundException(`Invalid status: ${status}`);
  }

  Abonnement.status = status === 'activated' ? Status.ACTIVATED : Status.DEACTIVATED;
  return await this.abonnementRepository.save(Abonnement);
}

async updateAbonnement(id: number, body: AbonnementDTO): Promise<Abonnement> {
  const abonnement= await this.abonnementRepository.findOne({ where: { id } });
  if (!abonnement) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }

  if (body.name !== undefined) {
    abonnement.name = body.name;
  }
 
 
 
 


  const updatedAbonnement = await this.abonnementRepository.save(abonnement);
  return updatedAbonnement;
}
}
