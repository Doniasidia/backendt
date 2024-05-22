// subscription.controller.ts
import { Controller, Get, Post, Body, ParseIntPipe, Param, Req, UnauthorizedException, Request, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';
import { Subscription } from './subscription.entity';
import { SubscriptionDTO } from './subscriptions.dto';

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
  @Post()
  async createSubscription(
   
    @Body() subscriptionDTO: SubscriptionDTO
  ): Promise<Subscription> {
    return this.subscriptionService.createSubscription(subscriptionDTO);
  }

}
