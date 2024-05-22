import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Subscription } from '@client/subscriptions/subscription.entity';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Client } from '@admin/client/client.entity';
import { Status } from '@enums/status';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async getNotifications( subscriberId: number): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: {
          subscriber: { id: subscriberId },
        }
      });
    } catch (error) {
      this.logger.error(`Error fetching notifications: ${error.message}`);
      throw error;
    }
  }
  async sendReminderNotifications(clientId: number): Promise<void> {
    this.logger.log(`Sending reminder notifications for subscribers of the client ID: ${clientId}`);
    const activeSubscriptions = await this.getAllActiveSubscriptions(clientId);

    const oneDayBefore = new Date();
    oneDayBefore.setDate(oneDayBefore.getDate() + 1);
    oneDayBefore.setHours(0, 0, 0, 0);

    const twoDaysBefore = new Date();
    twoDaysBefore.setDate(twoDaysBefore.getDate() + 2);
    twoDaysBefore.setHours(0, 0, 0, 0);

    for (const subscription of activeSubscriptions) {
      if (!(subscription.endDate instanceof Date)) {
        subscription.endDate = new Date(subscription.endDate);
      }
      if (isNaN(subscription.endDate.getTime())) {
        this.logger.error(`Invalid endDate format for subscription ID: ${subscription.id}`);
        continue;
      }
      const subscriptionEndDate = new Date(subscription.endDate);
      subscriptionEndDate.setHours(0, 0, 0, 0);

      if (subscriptionEndDate.getTime() === oneDayBefore.getTime()) {
        await this.saveReminderNotification(subscription, '1 day');
      } else if (subscriptionEndDate.getTime() === twoDaysBefore.getTime()) {
        await this.saveReminderNotification(subscription, '2 days');
      }
    }
  }

  async saveReminderNotification(subscription: Subscription, daysBefore: string): Promise<void> {
    const subscriber = await this.subscriberRepository.findOne({ where: { id: subscription.subscriberId } });
    if (!subscriber) {
      this.logger.error(`Subscriber not found for subscription ID: ${subscription.id}`);
      return;
    }

    const notification = new Notification();
    notification.subscriber = subscriber;
    notification.type = 'Reminder';
    notification.message = `Your subscription will expire in ${daysBefore}.`;
    notification.daysBefore = daysBefore;

    await this.notificationRepository.save(notification);
    this.logger.log(`Saved reminder notification for subscription ID: ${subscription.id}, ${daysBefore} before end date.`);
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
}
