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
        group = await this.groupRepository.findOne({ where: { id: subscriberDTO.groupId } });

      }
      if (subscriberDTO.planId) {
        plan = await this.planRepository.findOne({ where: { id: subscriberDTO.planId } });
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
      // else {
      //     throw new Error('Either group or plan must be selected');
      // }
      const insertResult = await this.subscriberRepository.insert(newSubscriber);
      const savedSubscriber = await this.subscriberRepository.findOne({
        where: { id: insertResult.identifiers[0].id }
      });

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