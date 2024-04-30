// subscribers.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { SubscriberController } from '@client/subscribers/subscribers.controller';
import { GroupsModule } from '@client/groups/groups.module';
import { PlansModule } from '@client/plans/plans.module';
import { Group } from '@client/groups/groups.entity';
import { Plan } from '@client/plans/plans.entity';
import { Invoice } from '@client/invoices/invoices.entity';
import { InvoiceModule } from '@client/invoices/invoices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber,Group,Plan,Invoice]),
    GroupsModule,PlansModule
  ],
  providers: [SubscriberService],
  controllers: [SubscriberController],
})
export class SubscriberModule {}