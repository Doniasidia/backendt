// invoice.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoices.service';
import { InvoiceDto } from './invoices.dto';
import { Invoice } from './invoices.entity';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { AuthGuard } from '@auth/auth.guard';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  

  @Get()
  @UseGuards(AuthGuard) 

  async findAllInvoices(): Promise<Invoice[]> {
    return await this.invoiceService.findAll();
  }


  
  
  @Get('active/subscriptions')
  @UseGuards(AuthGuard) 

  async getAllActiveSubscriptions(): Promise<Subscriber[]> {
    return await this.invoiceService.getAllActiveSubscriptions();
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
