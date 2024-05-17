// invoice.controller.ts

import { Controller, Get, Post, Body, Request, UseGuards, Param } from '@nestjs/common';
import { InvoiceService } from './invoices.service';
import { InvoiceDto } from './invoices.dto';
import { Invoice } from './invoices.entity';
import { Subscription } from '@client/subscriptions/subscription.entity';
import { AuthGuard } from '@auth/auth.guard';
import { Subscriber } from '@client/subscribers/subscribers.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
  @UseGuards(AuthGuard)
  @UseGuards(AuthGuard)
  @Get()
  async getAllInvoices(@Request() req): Promise<Invoice[]> {
    if (req.user.role === 'subscriber') {
      // Get the subscriber ID from the request object
      const subscriberId = req.user.sub;
      return await this.invoiceService.findInvoicesBySubscriberId(subscriberId);
    } else {
      // Get the client ID from the request object
      const clientId = req.user.sub;
      return await this.invoiceService.findInvoicesByClientId(clientId);
    }
  }
  @Get('active/subscriptions')
  @UseGuards(AuthGuard) 

  async getAllActiveSubscriptions(@Param('clientId') clientId: string): Promise<Subscriber[]> {
    return await this.invoiceService.getAllActiveSubscriptions(parseInt(clientId, 10));
  }
 @Post('generateinvoicesnextmonth/:clientId')
 @UseGuards(AuthGuard) 

async generateInvoicesForNextMonth(@Param('clientId') clientId: string): Promise<void> {
  await this.invoiceService.generateInvoicesForNextMonth(parseInt(clientId, 10));
}

  @Get(':subscriberId')
  @UseGuards(AuthGuard) 

  async findInvoicesBySubscriberId(@Param('subscriberId') subscriberId: string): Promise<Invoice[]> {
    return await this.invoiceService.findInvoicesBySubscriberId(parseInt(subscriberId, 10));
  }
  
}
