import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoices.entity';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Cron } from '@nestjs/schedule';
import { Group } from '@client/groups/groups.entity';
import { Plan } from '@client/plans/plans.entity';
import { Status } from '@enums/status';
import { Subscription } from '@client/subscriptions/subscription.entity';
import { Client } from '@admin/client/client.entity';
import { NotificationService } from '@client/notification/notification.service';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

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
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly notificationService: NotificationService,

  ) {}

  @Cron('0 0 * * *', { timeZone: 'Africa/Tunis' })
  async generateInvoicesCron(): Promise<void> {
    const clients = await this.clientRepository.find();
    for (const client of clients) {
      await this.generateInvoicesForSubscriptionsDueTomorrow(client.id);
      await this.notificationService.sendReminderNotifications(client.id);

    }
  }

  async generateInvoicesForSubscriptionsDueTomorrow(clientId: number): Promise<void> {
    this.logger.log(`Generating invoices for subscriptions due tomorrow for client ID: ${clientId}`);
    const activeSubscriptions = await this.getAllActiveSubscriptions(clientId);
    this.logger.log(`Found ${activeSubscriptions.length} active subscriptions`);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    this.logger.log(`Looking for subscriptions due on: ${tomorrow.toISOString().split('T')[0]}`);

    for (const subscription of activeSubscriptions) {
      this.logger.log(`Subscription ID ${subscription.id}: endDate - ${subscription.endDate}`);

      if (!(subscription.endDate instanceof Date)) {
        subscription.endDate = new Date(subscription.endDate);
      }

      if (isNaN(subscription.endDate.getTime())) {
        this.logger.error(`Invalid endDate format for subscription ID: ${subscription.id}`);
        continue;
      }

      const subscriptionEndDate = new Date(subscription.endDate);
      subscriptionEndDate.setHours(0, 0, 0, 0);

      this.logger.log(`Comparing endDate: ${subscriptionEndDate} with tomorrow: ${tomorrow}`);

      if (subscriptionEndDate.getTime() === tomorrow.getTime()) {
        this.logger.log(`Found subscription due tomorrow for subscription ID: ${subscription.id}`);
        if (['annuel', 'mensuel', 'Par session'].includes(subscription.type)) {
          const renewedSubscription = await this.renewSubscription(subscription, clientId);
          this.logger.log(`Renewed subscription ID: ${renewedSubscription.id}`);
          await this.generateInvoiceForSubscription(renewedSubscription, clientId);
        }
      } else {
        this.logger.log(`No subscription due tomorrow for subscription ID: ${subscription.id}`);
      }
    }
  }

  async renewSubscription(subscription: Subscription, clientId: number): Promise<Subscription> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });

    // Deactivate the old subscription
    subscription.status = Status.DEACTIVATED;
    await this.subscriptionRepository.save(subscription);

    const newSubscription = new Subscription();
    newSubscription.subscriberId = subscription.subscriberId;
    newSubscription.clientName = subscription.clientName;
    newSubscription.planName = subscription.planName;
    newSubscription.type = subscription.type;
    newSubscription.groupName = subscription.groupName;
    newSubscription.amount = subscription.amount;

    const startDate = new Date(subscription.endDate);
    startDate.setDate(startDate.getDate() + 1);
    newSubscription.startDate = startDate;

    let endDate: Date;
    switch (subscription.type) {
      case 'annuel':
        endDate = new Date(newSubscription.startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case 'mensuel':
        endDate = new Date(newSubscription.startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'Par session':
        endDate = new Date(newSubscription.startDate);
        endDate.setDate(endDate.getDate() + 1);
        break;
      default:
        throw new Error('Unsupported subscription type');
    }

    newSubscription.endDate = endDate;
    newSubscription.status = Status.ACTIVATED;
    newSubscription.createdBy = client;

    this.logger.log(`Saving renewed subscription: ${JSON.stringify(newSubscription)}`);
    return await this.subscriptionRepository.save(newSubscription);
  }

  async generateInvoiceForSubscription(subscription: Subscription, clientId: number): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });

    // Expire the old invoice
    const oldInvoice = await this.invoiceRepository.findOne({
      where: { subscription: { id: subscription.id } },
    });
    if (oldInvoice) {
      oldInvoice.status = Status.EXPIRED;
      await this.invoiceRepository.save(oldInvoice);
    }

    const newInvoice = new Invoice();
    newInvoice.subscriberId = subscription.subscriberId;
    newInvoice.subscriberName = subscription.subscriberName;
    newInvoice.amount = subscription.amount;
    newInvoice.createdAt = subscription.startDate;
    newInvoice.dueDate = subscription.endDate;
    newInvoice.status = Status.ACTIVATED;
    newInvoice.createdBy = client;
    newInvoice.clientName = subscription.clientName;

    this.logger.log(`Generating invoice for subscription ID: ${subscription.id}`);
    await this.invoiceRepository.save(newInvoice);
  }

  async getAllActiveSubscriptions(clientId: number): Promise<Subscription[]> {
    this.logger.log(`Fetching active subscriptions for client ID: ${clientId}`);
    return await this.subscriptionRepository.find({
      where: {
        createdBy: { id: clientId },
        status: Status.ACTIVATED,
      },
    });
  }

  async findInvoicesByClientId(clientId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: {
        createdBy: { id: clientId },
      },
    });
  }

  async findInvoicesBySubscriberId(subscriberId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: {
        subscriberId: subscriberId,
      },
    });
  }

  async findSubscriptionById(subscriptionId: number): Promise<Subscription> {
    return await this.subscriptionRepository.findOne({ where: { id: subscriptionId } });
  }
}
