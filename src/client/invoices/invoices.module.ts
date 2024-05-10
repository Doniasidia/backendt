// invoice.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoices.entity';
import { InvoiceController } from './invoices.controller';
import { InvoiceService } from './invoices.service';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberModule } from '@client/subscribers/subscribers.module';
import { Subscription } from '@client/subscriptions/subscription.entity';
import { SubscriptionsModule } from '@client/subscriptions/subscriptions.module';
import { jwtConstants } from '@auth/constants';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([Invoice,Subscription]), SubscriptionsModule,JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '100000s' },
  }),
],

  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
