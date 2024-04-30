// subscribers.service.ts

import {  Injectable, NotFoundException } from '@nestjs/common';
import { Subscriber} from '@client/subscribers/subscribers.entity';
import { SubscriberDTO } from '@client/subscribers/subscribers.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '@enums/status';
import * as bcrypt from 'bcrypt';
import { Group } from '@client/groups/groups.entity';
import { Plan } from '@client/plans/plans.entity';
import { Invoice } from '@client/invoices/invoices.entity';
@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    @InjectRepository(Group) // <-- Add @InjectRepository here
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async findAll(): Promise<Subscriber[]> {
    return await this.subscriberRepository.find();
  }

  async createSubscriber(subscriberDTO: SubscriberDTO): Promise<Subscriber> {
    console.log(subscriberDTO)
    try {
        // Look up the groupId and planId based on their names
        let group=null;
        let plan=null;
        if (subscriberDTO.groupId){
          group = await this.groupRepository.findOne({ where: { id: subscriberDTO.groupId } });

        }
        if(subscriberDTO.planId){

          plan = await this.planRepository.findOne({ where: { id: subscriberDTO.planId } });
        }
       

        // Create a new subscriber object and set its properties
        const newSubscriber = new Subscriber();
        newSubscriber.username = subscriberDTO.username;
        newSubscriber.firstname = subscriberDTO.firstname;
        newSubscriber.email = subscriberDTO.email;
        newSubscriber.telephone = subscriberDTO.telephone;

      if (group) {
          newSubscriber.groupId = group.id;}
      if (plan) {
          newSubscriber.planId = plan.id;
      } 
      // else {
      //     throw new Error('Either group or plan must be selected');
      // }
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
  
    if (body.username !== undefined) {
      subscriber.username = body.username;
    }
    
    if (body.firstname !== undefined) {
      subscriber.firstname = body.firstname;
    }
   
    if (body.email !== undefined) {
      subscriber.email = body.email;
    }
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

async findActiveSubscribersWithNoInvoicesForNextMonth(): Promise<Subscriber[]> {
  const currentDate = new Date();
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  const nextMonthYear = nextMonth.getFullYear();
  const nextMonthMonth = nextMonth.getMonth();

  // Query active subscribers who have no invoices for the next month
  const subscribers = await this.subscriberRepository.createQueryBuilder('subscriber')
    .leftJoinAndSelect('subscriber.invoices', 'invoice')
    .where('subscriber.status = :status', { status: Status.ACTIVATED })
    .andWhere('YEAR(invoice.dueDate) = :year', { year: nextMonthYear })
    .andWhere('MONTH(invoice.dueDate) = :month', { month: nextMonthMonth })
    .andWhere('invoice.id IS NULL')
    .getMany();

  return subscribers;
}
async generateInvoicesForNextMonth(): Promise<void> {
  // Get active subscribers
  const activeSubscribers = await this.subscriberRepository.find({
    where: { status: Status.ACTIVATED },
    relations: ['plan', 'group'], // Load the associated plan and group for each subscriber
  });

  // Generate invoices for each active subscriber
  for (const subscriber of activeSubscribers) {
    const nextMonthInvoice = new Invoice();
    nextMonthInvoice.subscriber = subscriber;

    if (subscriber.plan) {
      // If the subscriber has a direct plan, use the plan amount
      nextMonthInvoice.amount = subscriber.plan.amount;
    } else if (subscriber.group && subscriber.group.plan) {
      // If the subscriber belongs to a group and the group has a plan, use the group's plan amount
      nextMonthInvoice.amount = subscriber.group.plan.amount;
    } else {
      // Handle the case where neither the subscriber nor the group has a plan
      // You can throw an error or set a default amount here
      throw new Error('No plan found for subscriber or group');
    }

    nextMonthInvoice.createdAt = new Date(); // Set the date of the invoice to the current date
    // Set the due date of the invoice to the first day of next month
    const currentDate = new Date();
    nextMonthInvoice.dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    // Save the invoice
    await this.invoiceRepository.save(nextMonthInvoice);
  }
}
}