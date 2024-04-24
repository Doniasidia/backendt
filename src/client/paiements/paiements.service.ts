//paiements.service
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaiementDTO} from '@client/paiements/paiements.dto'; 
import { Paiement } from '@client/paiements/paiements.entity';
import { Status } from '@enums/status';
import { Plan } from '@client/plans/plans.entity';

@Injectable()
export class PaiementsService {
  constructor(
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Paiement[]> {
    return await this.paiementRepository.find();
  }

  async createPaiement(paiementDTO: PaiementDTO): Promise<Paiement> {
    try{
    const planId = await this.planRepository.findOne({ where: { name: paiementDTO.planName } });
    const newPaiement = new Paiement();
    newPaiement.name = paiementDTO.name;
  
    const savedPaiement = await this.paiementRepository.save(newPaiement);
        
    return savedPaiement;
} catch (error) {
    // Handle any errors that occur during the process
    console.error('Error creating subscriber:', error);
    throw error; // Optionally, you can throw the error to be handled by the caller
}
}
  
  

   
   
  async deactivatePaiement(id: number): Promise<Paiement> {
    const paiement= await this.paiementRepository.findOne({ where: { id } });
    if (!paiement) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    paiement.status = Status.DEACTIVATED;
    return await this.paiementRepository.save(paiement);
  }
  


  
   
  async getPaiementById(id: number): Promise<Paiement> {
    const paiement = await this.paiementRepository.findOne({ where: { id } });
    if (!paiement) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return paiement;
}
async updatePaiementStatus(id: number, status: string): Promise<Paiement> {
  const Paiement = await this.paiementRepository.findOne({ where: { id } });
  if (!Paiement) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }

  // Validate status
  if (status !== 'activated' && status !== 'deactivated') {
    throw new NotFoundException(`Invalid status: ${status}`);
  }

  Paiement.status = status === 'activated' ? Status.ACTIVATED : Status.DEACTIVATED;
  return await this.paiementRepository.save(Paiement);
}

async updatePaiement(id: number, body: PaiementDTO): Promise<Paiement> {
  const paiement= await this.paiementRepository.findOne({ where: { id } });
  if (!paiement) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }

  if (body.name !== undefined) {
    paiement.name = body.name;
  }
 
 
 
 


  const updatedPaiement = await this.paiementRepository.save(paiement);
  return updatedPaiement;
}
}
