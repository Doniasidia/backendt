// invoice.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoices.entity';
import { InvoiceController } from './invoices.controller';
import { InvoiceService } from './invoices.service';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberModule } from '@client/subscribers/subscribers.module';


@Module({
  imports: [TypeOrmModule.forFeature([Invoice,Subscriber]), SubscriberModule], 
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
