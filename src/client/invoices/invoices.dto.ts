// create-invoice.dto.ts

import { Subscriber } from "@client/subscribers/subscribers.entity";

export class InvoiceDto {
    subscriber: Subscriber;
    amount: number;
    dueDate: Date;
  }
  