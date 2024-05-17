//subscriber.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { SubscriberController } from '@client/subscribers/subscribers.controller';
import { GroupsModule } from '@client/groups/groups.module';
import { PlansModule } from '@client/plans/plans.module';
import { Group } from '@client/groups/groups.entity';
import { Plan } from '@client/plans/plans.entity';
import { Invoice } from '@client/invoices/invoices.entity';
import { jwtConstants } from '@auth/constants';
import { Client } from '@admin/client/client.entity';
import { Subscription } from '@client/subscriptions/subscription.entity';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber, Group, Plan, Client, Subscription, Invoice]),
    GroupsModule,
    PlansModule,
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100000s' },
    }),
  ],
  providers: [
    SubscriberService,
  ],
  controllers: [SubscriberController],
})
export class SubscriberModule { }
