//subscriber.controller
import { Controller, Get, Post, Request, Param, Body, UseGuards, NotFoundException, Patch, ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { SubscriberDTO } from '@client/subscribers/subscribers.dto';
import { AuthGuard } from '@auth/auth.guard';

@Controller('subscribers')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) { }


  @Get()
  @UseGuards(AuthGuard) // Apply the authentication guard to protect this endpoint
  async getAllSubscribers(@Request() req): Promise<Subscriber[]> {
    // Check if req.user and req.user.sub are defined
    if (!req.user || !req.user.sub) {
      throw new UnauthorizedException('User ID not found in request');
    }

    // Get the user ID from the request object (assuming it's stored in the user property)
    const clientId = req.user.sub;
    return await this.subscriberService.findSubscribersByClientId(clientId);

    // Other controller methods...
  }

  @Post()
  @UseGuards(AuthGuard)
  async createSubscriber(@Body() subscriberDTO: SubscriberDTO, @Request() req): Promise<Subscriber> {
    // Get the user ID from the request object (assuming it's stored in the user property)
    const clientId = req.user.sub;
    return await this.subscriberService.createSubscriber(subscriberDTO, clientId);
  }
  @Post('register')
  async registerSubscriber(@Body() subscriberDTO: SubscriberDTO): Promise<Subscriber> {
    // Implement subscriber self-registration logic here
    // You may need to validate the data before creating the subscriber
    return await this.subscriberService.registerSubscriber(subscriberDTO, null);
  }

  @Patch(':id')
  async updateSubscriber(@Param('id', ParseIntPipe) id: number, @Body() subscriberDTO: SubscriberDTO): Promise<Subscriber> {
    return await this.subscriberService.updateSubscriber(id, subscriberDTO);
  }

  @Patch(':email/add-password')
  async addPasswordForSubscriber(@Param('email') email: string, @Body() body: { password: string }): Promise<Subscriber> {
    return await this.subscriberService.addPasswordForSubscriber(email, body);
  }

  @Patch(':id/deactivate')
  async deactivateSubscriber(@Param('id', ParseIntPipe) id: number): Promise<Subscriber> {
    try {
      return await this.subscriberService.deactivateSubscriber(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  async getSubscriberById(@Param('id', ParseIntPipe) id: number): Promise<Subscriber> {
    return await this.subscriberService.getSubscriberById(id);
  }

  @Patch(':id/status')
  async updateSubscriberStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: string }): Promise<Subscriber> {
    try {
      return await this.subscriberService.updateSubscriberStatus(id, body.status);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
