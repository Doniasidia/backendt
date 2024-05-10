// subscribers.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberDTO } from '@client/subscribers/subscribers.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '@enums/status';
import * as bcrypt from 'bcrypt';
import { Group } from '@client/groups/groups.entity';
import { Plan } from '@client/plans/plans.entity';
import { Invoice } from '@client/invoices/invoices.entity';
import { User } from '@user/user.entity';
import { Client } from '@admin/client/client.entity';
import { Subscription } from '@client/subscriptions/subscription.entity';
import { round } from 'lodash';


@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    @InjectRepository(Group) // <-- Add @InjectRepository here
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Client) // Inject the Client repository
    private clientRepository: Repository<Client>,
    @InjectRepository(Subscription) // Inject the Client repository
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Invoice) // Inject the Client repository
    private invoiceRepository: Repository<Invoice>,
  ) { }

 
  async findSubscribersByClientId(clientId: number): Promise<Subscriber[]> {
    return await this.subscriberRepository.find({
      where: {
        createdBy: { id: clientId }
      }
    });
  }

  async createSubscriber(subscriberDTO: SubscriberDTO, clientId: number): Promise<Subscriber> {
    try {
      // Look up the groupId and planId based on their names
      let group = null;
      let plan = null;
      if (subscriberDTO.groupId) {
        group = await this.groupRepository.findOne({ where: { id: subscriberDTO.groupId }, relations: ["plan"] });
        if (!group) {
          throw new NotFoundException(`Group with ID ${subscriberDTO.groupId} not found`);
        }
        // Set the planId to the planId of the group if a group is selected
        if (group.plan) {
          plan = group.plan;
        } else {
          throw new NotFoundException(`Plan not found for the selected group with ID ${subscriberDTO.groupId}`);
        }
      } else if (subscriberDTO.planId) {
        plan = await this.planRepository.findOne({ where: { id: subscriberDTO.planId } });
        if (!plan) {
          throw new NotFoundException(`Plan with ID ${subscriberDTO.planId} not found`);
        }
      } else {
        throw new Error("Either groupId or planId must be provided.");
      }
  
      // Fetch the client entity
      const client = await this.clientRepository.findOne({ where: { id: clientId } });
  
      // Create a new subscriber object and set its properties
      const newSubscriber = new Subscriber();
      newSubscriber.username = subscriberDTO.username;
      newSubscriber.firstname = subscriberDTO.firstname;
      newSubscriber.email = subscriberDTO.email;
      newSubscriber.telephone = subscriberDTO.telephone;
      newSubscriber.createdBy = client;
  
      if (group) {
        newSubscriber.groupId = group.id;
      }
      if (plan) {
        newSubscriber.planId = plan.id;
      }
  
      // Save the subscriber to the database
      const savedSubscriber = await this.subscriberRepository.save(newSubscriber);
  
      // Create a new subscription associated with the newly created subscriber
      const newSubscription = new Subscription();
      newSubscription.subscriber = savedSubscriber;
      newSubscription.clientName = client.username; 
      newSubscription.planName = plan ? plan.name : null; 
      newSubscription.groupName = group ? group.name : null; 
  
      // Determine the amount based on whether the subscriber is associated with a plan directly or through a group
      if (plan) {
        newSubscription.amount = round(plan.amount, 3).toString();
      } else if (group && group.planId) {
        const groupPlan = await this.planRepository.findOne({ where: { id: group.planId } });
        if (groupPlan) {
          newSubscription.amount = round(groupPlan.amount, 3).toString();
        } else {
          throw new Error(`Plan not found for group with ID ${group.id}`);
        }
      } else {
        throw new Error(`Plan not found for subscriber with ID ${savedSubscriber.id}`);
      }
  
      // Save the subscription to the database
      await this.subscriptionRepository.save(newSubscription);
      const newInvoice = new Invoice();
      
newInvoice.subscriberId = savedSubscriber.id;
newInvoice.subscriberName = savedSubscriber.username;
newInvoice.amount = parseFloat(newSubscription.amount.toString());

// Set the date of the invoice to the current date
newInvoice.createdAt = new Date();

// Calculate the due date for the invoice (next month)
const currentDate = new Date();
const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
newInvoice.dueDate = dueDate;
newInvoice.createdBy = client;
newInvoice.clientName = client.username;


// Save the invoice to the database
await this.invoiceRepository.save(newInvoice);
  
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


  async updateSubscriber(id: number, body: SubscriberDTO): Promise<Subscriber> {
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
}