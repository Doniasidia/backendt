// subscription.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findSubscriptionsBySubscriberId(subscriberId: number): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: {
        subscriber: { id: subscriberId }
      }
    });
  }



 
 
}
