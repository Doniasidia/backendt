import { BadRequestException, Controller, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoices.service';
import { Invoice } from './invoices.entity';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { AuthGuard } from '@auth/auth.guard';
import { Subscription } from '@client/subscriptions/subscription.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllInvoices(@Request() req): Promise<Invoice[]> {
    if (req.user.role === 'subscriber') {
      const subscriberId = req.user.sub;
      return await this.invoiceService.findInvoicesBySubscriberId(subscriberId);
    } else {
      const clientId = req.user.sub;
      return await this.invoiceService.findInvoicesByClientId(clientId);
    }
  }

  @UseGuards(AuthGuard)
  @Get('active/subscriptions')
  async getAllActiveSubscriptions(@Request() req): Promise<Subscription[]> {
    const clientId = req.user.sub;
    return await this.invoiceService.getAllActiveSubscriptions(clientId);
  }

  @UseGuards(AuthGuard)
  @Get(':subscriberId')
  async findInvoicesBySubscriberId(@Param('subscriberId') subscriberId: string): Promise<Invoice[]> {
    return await this.invoiceService.findInvoicesBySubscriberId(parseInt(subscriberId, 10));
  }
  @UseGuards(AuthGuard)
  @Post('renew/:subscriptionId')
  async renewSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Req() req: any // Assuming req contains authenticated user info
  ): Promise<Subscription> {
    const subscription = await this.invoiceService.findSubscriptionById(parseInt(subscriptionId, 10));
    const clientId = req.user.id; // Adjust this line based on how you retrieve the client ID
    return await this.invoiceService.renewSubscription(subscription, clientId);
  }
  @UseGuards(AuthGuard)
  @Post('generate-due-tomorrow/:clientId')
  async generateInvoicesForSubscriptionsDueTomorrow(@Param('clientId') clientId: string): Promise<{ message: string }> {
    const parsedClientId = parseInt(clientId, 10);
    if (isNaN(parsedClientId)) {
      throw new BadRequestException('Invalid client ID');
    }
    await this.invoiceService.generateInvoicesForSubscriptionsDueTomorrow(parsedClientId);
    return { message: 'Invoices for subscriptions due tomorrow have been generated' };
  }
}
