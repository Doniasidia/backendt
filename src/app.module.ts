// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from '@entity/calendar.entity';
import { Invoice } from '@entity/invoice.entity';
import { Message } from '@entity/message.entity';
import { Payment } from '@entity/payment.entity';
import { Plan} from '@client/plans/plans.entity';
import { Subscription } from '@client/subscription/subscription.entity';
import { Sessions } from '@entity/sessions.entity';
import { Client } from '@admin/client/client.entity';
import { Admin } from '@entity/admin.entity';
import { User } from '@user/user.entity';
import { ClientService } from '@admin/client/clients.service';
import { ClientController } from '@admin/client/clients.controller';
import { ClientModule } from '@admin/client/clients.module';
import { AuthModule } from '@auth/auth.module';
import { Repository } from 'typeorm';
import { UserRepository } from '@user/user.repository';
import { UserService } from '@user/user.service';
import { UserModule } from '@user/user.module';
import { ClientRepository } from '@user/client.repository';
import { AdminRepository } from '@user/admin.repository';
import { SubscriberRepository } from '@user/subscriber.repository';
import { PlansController } from '@client/plans/plans.controller';
import { PlansService } from '@client/plans/plans.service';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { SubscriberController } from '@client/subscribers/subscriber.controller';
import { SubscriberModule } from '@client/subscribers/subscribers.module';
import { Subscriber } from '@client/subscribers/subscribers.entity';






@Module({
  imports: [
    TypeOrmModule.forFeature([Client,Plan , 
      Subscriber
    ]),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          Calendar,
          Invoice,
          Message,
          Payment,
          Sessions,
          Plan,
          Subscription,
          Subscriber,
          Client,
          Admin,
          User
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ClientModule,AuthModule,UserModule,
    SubscriberModule
  ],
  controllers: [AppController, ClientController,PlansController
   ,SubscriberController
   ],
  providers: [AppService, ClientService, Repository,UserRepository,UserService,ClientRepository,AdminRepository, PlansService, Plan
  ,SubscriberService,SubscriberRepository
  ],
})
export class AppModule {}