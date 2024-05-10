import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoices.entity';
import { InvoiceDto } from './invoices.dto';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Group } from '@client/groups/groups.entity';
import { Plan } from '@client/plans/plans.entity';
import { Status } from '@enums/status';
import { round } from 'lodash';
import { Subscription } from '@client/subscriptions/subscription.entity';



@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Group) 
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async findInvoicesByClientId(clientId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: {
        createdBy: { id: clientId }
      }
    });
  }

  
  async findInvoicesBySubscriberId(subscriberId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: {
        subscriberId: subscriberId
      }
    });
  }
 


 
}