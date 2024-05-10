// create-invoice.dto.ts

import { Subscriber } from "@client/subscribers/subscribers.entity";
import { Subscription } from "@client/subscriptions/subscription.entity";

export class InvoiceDto {
    subscription: Subscription;
    amount: number;
    dueDate: Date;
  }
  