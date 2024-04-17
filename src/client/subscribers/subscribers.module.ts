// subscribers.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { SubscriberController } from '@client/subscribers/subscribers.controller';
import { GroupesModule } from '@client/groupes/groupes.module'; 
import { PlansModule } from '@client/plans/plans.module';
import { group } from 'console';
import { Groupe } from '@client/groupes/groupes.entity';
import { Plan } from '@client/plans/plans.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber,Groupe,Plan]),
    GroupesModule,PlansModule 
  ],
  providers: [SubscriberService],
  controllers: [SubscriberController],
})
export class SubscriberModule {}