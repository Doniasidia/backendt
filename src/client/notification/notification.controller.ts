import { Controller, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':subscriberId')
  async getNotifications(
    @Param('subscriberId') subscriberId: number
  ) {
    return this.notificationService.getNotifications(subscriberId);
  }
}
