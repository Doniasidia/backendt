import { Controller, Get, Post, Delete, Param, Body, UseGuards, NotFoundException, Patch, ParseIntPipe } from '@nestjs/common';
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

  @Post()
  async createSubscriber(@Body() subscriberDTO: SubscriberDTO): Promise<Subscriber> {
    return await this.subscriberService.createSubscriber(subscriberDTO);
  }

  @Patch(':id')
  async updateSubscriber(@Param('id', ParseIntPipe) id: number, @Body() subscriberDTO: SubscriberDTO): Promise<Subscriber> {
    return await this.subscriberService.updateSubscriber(id, subscriberDTO);
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
