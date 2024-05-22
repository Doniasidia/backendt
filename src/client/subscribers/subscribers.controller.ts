//subscriber.controller
import { Controller, Get, Post, Request, Param, Body, UseGuards, NotFoundException, Patch, ParseIntPipe, UnauthorizedException, ValidationPipe, UsePipes } from '@nestjs/common';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { SubscriberDTO } from '@client/subscribers/dto/subscribers.dto';
import { AuthGuard } from '@auth/auth.guard';
import { CreateSubscriberDTO } from './dto/createSubscribers.dto';
import { ResponseError, ResponseSuccess } from '@src/common/dto/response.dto';
import { ResponseCode } from '@src/common/interfaces/responsecode.interface';

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


  @UsePipes(new ValidationPipe())
  @Post('register/subscriber')
  async registerSubscriber(@Body() subscriberData: CreateSubscriberDTO) {
    const entity = Object.assign(new Subscriber(), subscriberData);

    // check Subscriber exist 
    const isSubscriberExists = await this.subscriberService.checkSubscriberExists(entity.email);
    if (isSubscriberExists) {
      return new ResponseError(ResponseCode.RESULT_USER_EXISTS, "This subscriber already exists. Please use a different email address or login.");
    }

    // create a new subscriber
    try {
      const subscriber = await this.subscriberService.createSubscriberVisitor(entity);

      if (subscriber) {
        return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, "A verification link has been sent to your email address. Please check your email to complete the registration.");
      } else {
        return new ResponseError(ResponseCode.RESULT_FAIL, "There was an issue sending the verification email. Please try again later.");
      }

    } catch (error) {
      return new ResponseError(ResponseCode.RESULT_FAIL, "An error occurred during registration. Please try again.");
    }
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
