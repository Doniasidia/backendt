// subscription.controller.ts
import { Controller, Get, Post, Body, ParseIntPipe, Param, Req, UnauthorizedException, Request, NotFoundException } from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';
import { Subscription } from './subscription.entity';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  @Get('subscriber/:subscriberId')
  async getSubscriptionsBySubscriberId(@Param('subscriberId', ParseIntPipe) subscriberId: number): Promise<Subscription[]> {
    const subscriptions = await this.subscriptionService.findSubscriptionsBySubscriberId(subscriberId);
    if (!subscriptions || subscriptions.length === 0) {
      throw new NotFoundException(`Subscriptions for subscriber with ID ${subscriberId} not found`);
    }
    return subscriptions;
  }
}