import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoices.entity';
import { InvoiceDto } from './invoices.dto';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly subscriberService: SubscriberService,
  ) {}

  async createInvoiceForNextMonth(): Promise<void> {
    // Get active subscribers who have no invoices for the next month
    const subscribers = await this.subscriberService.findActiveSubscribersWithNoInvoicesForNextMonth();
  
    // Generate invoices for these subscribers
    for (const subscriber of subscribers) {
      const amount = subscriber.plan.amount; // Access the amount property of the associated plan
      const invoiceDto: InvoiceDto = {
        subscriber, // Pass the Subscriber entity directly
        amount,
        dueDate: this.calculateDueDateForNextMonth(), 
      };
      await this.create(invoiceDto);
    }
  }

  async create(createInvoiceDto: InvoiceDto): Promise<Invoice> {
    const invoice = this.invoiceRepository.create(createInvoiceDto);
    return await this.invoiceRepository.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find();
  }

  async findBySubscriberId(subscriberId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({ where: { subscriberId } });
  }
  
  async generateInvoicesManually(): Promise<void> {
    await this.createInvoiceForNextMonth();
  }

  private calculateDueDateForNextMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  }
}
