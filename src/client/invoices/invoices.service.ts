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
import { Client } from '@admin/client/client.entity';



@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Group) 
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Client) 
    private readonly clientRepository: Repository<Client>, // Inject the Client repository
  ) {}

  @Cron('* * * * * *', { timeZone: 'Europe/Paris' })
  async generateInvoicesCron(): Promise<void> {
    // Get all clients
    const clients = await this.clientRepository.find();

    // Loop through each client
    for (const client of clients) {
      await this.generateInvoicesForNextMonth(client.id);
    }
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find();
  }

  async getAllActiveSubscriptions(clientId: number): Promise<Subscriber[]> {
    // Get all active subscribers belonging to the client
    return await this.subscriberRepository.find({ where: { id: clientId , status: Status.ACTIVATED } });
}


  async generateInvoicesForNextMonth(clientId: number): Promise<void> {
    // Get all active subscribers belonging to the client
    const activeSubscribers = await this.getAllActiveSubscriptions(clientId);
  
    // Loop through each active subscriber
    for (const subscriber of activeSubscribers) {
      // Check if the subscriber already has an invoice for the next month
      const existingInvoice = await this.invoiceRepository.findOne({
        where: {
          subscriber: subscriber,
          dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) // Due date for next month
        }
      });
  
      // If there's no existing invoice, create a new one
      if (!existingInvoice) {
        const nextMonthInvoice = new Invoice();
        const client = await this.clientRepository.findOne({ where: { id: clientId } });

        nextMonthInvoice.subscriber = subscriber;
        nextMonthInvoice.subscriberName = subscriber.firstname; // Assuming the name property exists in the Subscriber entity

        // Set the amount based on the subscriber's plan or group's plan
        if (subscriber.planId) {
          // Fetch the plan from the database using the planId
          const planOptions = { where: { id: subscriber.planId } };
          const plan: Plan = await this.planRepository.findOne(planOptions);
          if (plan) {
            nextMonthInvoice.amount = round(plan.amount, 3).toString(); // Convert to string with desired precision
          } else {
            throw new Error(`Plan not found for subscriber with ID ${subscriber.id}`);
          }
        } else if (subscriber.groupId) {
          // Fetch the group from the database using the groupId
          const groupOptions = { where: { id: subscriber.groupId } };
          const group: Group = await this.groupRepository.findOne(groupOptions);
          if (group && group.planId) {
            // Fetch the plan from the database using the planId of the group
            const planOptions = { where: { id: group.planId } };
            const plan: Plan = await this.planRepository.findOne(planOptions);
            if (plan) {
              nextMonthInvoice.amount = round(plan.amount, 3).toString(); // Convert to string with desired precision
            } else {
              throw new Error(`Plan not found for group with ID ${group.id}`);
            }
          } else {
            throw new Error(`Plan not found for group with ID ${group.id}`);
          }
        }
  
        nextMonthInvoice.createdAt = new Date(); // Set the date of the invoice to the current date
        nextMonthInvoice.dueDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1); // Due date for next month
        nextMonthInvoice.createdBy = client;

  
        // Save the invoice
        await this.invoiceRepository.save(nextMonthInvoice);
      }
    }
  }

  async findInvoicesBySubscriberId(subscriberId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({ where: { subscriber: { id: subscriberId } } });
  }
}
