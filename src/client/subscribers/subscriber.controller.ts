// subscribers.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, NotFoundException, Patch } from '@nestjs/common';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { SubscriberDTO } from '@client/subscribers/subscribers.dto';





@Controller('subscribers')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}
  
  @Get()
  async getAllSubscribers(): Promise<Subscriber[]> {
    return await this.subscriberService.findAll();
  }
  @Put(':id')
  async updateSubscriber(@Param('id') id: number, @Body() SubscriberDTO: SubscriberDTO): Promise<Subscriber> {
    return await this.subscriberService.updateSubscriber(id, SubscriberDTO);
  }
  
  @Post()
  async createSubscriber(@Body() body: SubscriberDTO): Promise<Subscriber> {
    return await this.subscriberService.createSubscriber(body);
  }
 
  @Patch(':id/deactivate') 
async deactivateSubscriber(@Param('id') id: number): Promise<Subscriber> {
  try {
    return await this.subscriberService.deactivateSubscriber(id);
  } catch (error) {
    throw new NotFoundException(error.message);
  }
}
@Get(':id')
  async getClientById(@Param('id') id: string): Promise<Subscriber> {
    return await this.subscriberService.getSubscriberById(+id); 
  }

@Patch(':id/status')
async updateSubscriberStatus(@Param('id') id: number, @Body() body: { status: string }): Promise<Subscriber> {
  try {
    return await this.subscriberService.updateSubscriberStatus(id, body.status);
  } catch (error) {
    throw new NotFoundException(error.message);
  }
}
}
