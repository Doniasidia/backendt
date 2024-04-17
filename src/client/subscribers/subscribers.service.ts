// subscribers.service.ts

import {  Injectable, NotFoundException } from '@nestjs/common';
import { Subscriber} from '@client/subscribers/subscribers.entity';
import { SubscriberDTO } from '@client/subscribers/subscribers.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '@enums/status';
import * as bcrypt from 'bcrypt';
import { Groupe } from '@client/groupes/groupes.entity';
import { Plan } from '@client/plans/plans.entity';
@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    @InjectRepository(Groupe) // <-- Add @InjectRepository here
    private readonly groupeRepository: Repository<Groupe>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Subscriber[]> {
    return await this.subscriberRepository.find();
  }

  async createSubscriber(subscriberDTO: SubscriberDTO): Promise<Subscriber> {
    try {
        // Look up the groupId and planId based on their names
        const groupeId = await this.groupeRepository.findOne({ where: { name: subscriberDTO.groupName } });
        const planId = await this.planRepository.findOne({ where: { name: subscriberDTO.planName } });

        // Create a new subscriber object and set its properties
        const newSubscriber = new Subscriber();
        newSubscriber.username = subscriberDTO.nom;
        newSubscriber.FirstName = subscriberDTO.prenom;
        newSubscriber.email = subscriberDTO.email;
        newSubscriber.telephone = subscriberDTO.telephone;
        newSubscriber.groupeId = groupeId?.id; 
        newSubscriber.planId = planId?.id; 

        // Save the new subscriber to the database
        const savedSubscriber = await this.subscriberRepository.save(newSubscriber);
        
        return savedSubscriber;
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error creating subscriber:', error);
        throw error; // Optionally, you can throw the error to be handled by the caller
    }
}

  async deactivateSubscriber(id: number): Promise<Subscriber> {
    const subscriber = await this.subscriberRepository.findOne({ where: { id } });
    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }
    
    subscriber.status = Status.DEACTIVATED;
    return await this.subscriberRepository.save(subscriber);
  }
  

  async updateSubscriber  (id: number, body: SubscriberDTO): Promise<Subscriber> {
    const subscriber = await this.subscriberRepository.findOne({ where: { id } });
    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }
  
    if (body.nom !== undefined) {
      subscriber.username = body.nom;
    }
    
    if (body.prenom !== undefined) {
      subscriber.FirstName = body.prenom;
    }
    if (body.prenom !== undefined) {
      subscriber.FirstName = body.prenom;
    }
    /*if (body.email !== undefined) {
      subscriber.email = body.email;
    }*/
    if (body.telephone !== undefined) {
      subscriber.telephone = body.telephone;
    }
   
    /*if (body.password !== undefined) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      subscriber.password = hashedPassword;
    }*/
   
  
    const updatedSubscriber = await this.subscriberRepository.save(subscriber);
    return updatedSubscriber;
  }
  async getSubscriberById(id: number): Promise<Subscriber> {
    const subscriber = await this.subscriberRepository.findOne({ where: { id } });
    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }
    return subscriber;
}
async updateSubscriberStatus(id: number, status: string): Promise<Subscriber> {
  const subscriber = await this.subscriberRepository.findOne({ where: { id } });
  if (!subscriber) {
    throw new NotFoundException(`Subscriber with ID ${id} not found`);
  }

  // Validate status
  if (status !== 'activated' && status !== 'deactivated') {
    throw new NotFoundException(`Invalid status: ${status}`);
  }

  subscriber.status = status === 'activated' ? Status.ACTIVATED : Status.DEACTIVATED;
  return await this.subscriberRepository.save(subscriber);
}
async findSubscriberByTelephone(telephone: string): Promise<Subscriber | null> {
  return await this.subscriberRepository.findOne({ where: { telephone } });
}

}