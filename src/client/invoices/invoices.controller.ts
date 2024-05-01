// invoice.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';
import { InvoiceService } from './invoices.service';
import { InvoiceDto } from './invoices.dto';
import { Invoice } from './invoices.entity';
import { Subscriber } from '@client/subscribers/subscribers.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  


  @Get()
  async findAllInvoices(): Promise<Invoice[]> {
    return await this.invoiceService.findAll();
  }


  
  
  @Get('active/subscriptions')
  async getAllActiveSubscriptions(): Promise<Subscriber[]> {
    return await this.invoiceService.getAllActiveSubscriptions();
  }
  @Post('generateinvoicesnextmonth')
  async generateInvoicesForNextMonth(): Promise<void> {
    await this.invoiceService.generateInvoicesForNextMonth();
  }
  
}
