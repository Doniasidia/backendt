// invoice.controller.ts

import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoices.service';
import { InvoiceDto } from './invoices.dto';
import { Invoice } from './invoices.entity';
import { Subscription } from '@client/subscriptions/subscription.entity';
import { AuthGuard } from '@auth/auth.guard';

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
 

  
  
 
  
}
