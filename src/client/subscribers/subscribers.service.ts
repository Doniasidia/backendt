// subscribers.service.ts

import {  Injectable, NotFoundException } from '@nestjs/common';
import { Subscriber} from '@client/subscribers/subscribers.entity';
import { SubscriberDTO } from '@client/subscribers/subscribers.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '@enums/status';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async findAll(): Promise<Subscriber[]> {
    return await this.subscriberRepository.find();
  }

  async createSubscriber(subscriberDTO: SubscriberDTO): Promise<Subscriber> {
   // const hashedPassword = await bcrypt.hash(body.password, 10);
    const newSubscriber = new Subscriber();
    newSubscriber.username = subscriberDTO.nom;
    newSubscriber.FirstName = subscriberDTO.prenom;
    newSubscriber.email = subscriberDTO.email;
    newSubscriber.telephone = subscriberDTO.telephone;
   
    //newSubscriber.password = hashedPassword; 
    newSubscriber.enLigne = subscriberDTO.enLigne;
    const savedSubscriber = await this.subscriberRepository.save(newSubscriber);
    return savedSubscriber;
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
    if (body.enLigne !== undefined) {
      subscriber.enLigne = body.enLigne;
    }
  
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
}
