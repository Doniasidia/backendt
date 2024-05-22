//Paiements.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionService } from './subscriptions.service';
import { Subscription } from './subscription.entity';
import { Invoice } from '@client/invoices/invoices.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription,Invoice]), 
    SubscriptionsModule// IncludeRepository in TypeOrmModule's forFeature()
  ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionsModule {}