// subscribers.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { SubscriberController } from '@client/subscribers/subscriber.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  providers: [SubscriberService],
  controllers: [SubscriberController],
})
export class SubscriberModule {}