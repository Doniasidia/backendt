// invoice.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';
import { InvoiceService } from './invoices.service';
import { InvoiceDto } from './invoices.dto';
import { Invoice } from './invoices.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() InvoiceDto: InvoiceDto): Promise<Invoice> {
    return await this.invoiceService.create(InvoiceDto);
  }

  @Get()
  async findAll(): Promise<Invoice[]> {
    return await this.invoiceService.findAll();
  }

  @Get(':subscriberId')
  async findBySubscriberId(subscriberId: number): Promise<Invoice[]> {
    return await this.invoiceService.findBySubscriberId(subscriberId);
  }
  @Post('generate-manually')
  async generateInvoicesManually(): Promise<void> {
    await this.invoiceService.generateInvoicesManually();
  }
}
