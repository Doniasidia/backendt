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

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber,Group,Plan]),
    GroupsModule,PlansModule 
  ],
  providers: [SubscriberService],
  controllers: [SubscriberController],
})
export class SubscriberModule {}