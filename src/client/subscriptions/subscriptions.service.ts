// subscription.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionDTO } from './subscriptions.dto';
import { Client } from '@admin/client/client.entity';
import { Subscriber } from '@client/subscribers/subscribers.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async findSubscriptionsBySubscriberId(subscriberId: number): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: {
        subscriber: { id: subscriberId },
      
      }
    });
  }


  async createSubscription(subscriptionDTO: SubscriptionDTO): Promise<Subscription> {
  
    const client = await this.clientRepository.findOne({ where: { id: subscriptionDTO.createdById } });
    if (!client) {
      throw new Error('Client not found');
    }
    const subscriber = await this.subscriberRepository.findOne({ where: { id: subscriptionDTO.subscriberId } });
    if (!subscriber) {
      throw new Error('Subscriber not found');
    }
  
    const newSubscription = new Subscription();
    newSubscription.amount = subscriptionDTO.amount;
    newSubscription.subscriberId = subscriptionDTO.subscriberId;
    newSubscription.subscriberName = subscriptionDTO.subscriberName;
    newSubscription.clientName = subscriptionDTO.clientName;
    newSubscription.planName = subscriptionDTO.planName;
    newSubscription.startDate = subscriptionDTO.startDate;
    newSubscription.endDate = subscriptionDTO.endDate;
    newSubscription.type = subscriptionDTO.type;
    newSubscription.groupName = subscriptionDTO.groupName;
    newSubscription.createdBy = client;
    newSubscription.subscriber = subscriber;

    const savedSubscription = await this.subscriptionRepository.save(newSubscription);
    return savedSubscription;
  }
 
 
}
